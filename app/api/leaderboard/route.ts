import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";
import {leaderboard} from "@/lib/db/schema";
import {desc} from "drizzle-orm"; // your db client

const SECRET = process.env.LEADERBOARD_SECRET!;

// GameClient:
//
// const SECRET = "your-shared-secret";
// const name = "PlayerOne";
// const score = 9999;
// const timestamp = Date.now();
//
// const payload = `${name}:${score}:${timestamp}`;
// const signature = hmacSha256(SECRET, payload); // use your engine's crypto lib
//
// fetch("https://yoursite.com/api/leaderboard", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ name, score, timestamp, signature }),
// });

function verifySignature(payload: string, signature: string): boolean {
	const expected = createHmac("sha256", SECRET)
		.update(payload)
		.digest("hex");

	// timing-safe compare prevents timing attacks
	try {
		return timingSafeEqual(
			Buffer.from(signature, "hex"),
			Buffer.from(expected, "hex")
		);
	} catch {
		return false;
	}
}

// GET — fetch leaderboard (public)
export async function GET() {
	const scores = await db
		.select()
		.from(leaderboard)
		.orderBy(desc(leaderboard.time))
		.limit(100);
	return NextResponse.json(scores);
}

// POST — submit a score
export async function POST(req: NextRequest) {
	const body = await req.json();
	const { name, score, timestamp, signature } = body;

	// reject old requests (replay attack prevention — 30s window)
	const now = Date.now();
	if (Math.abs(now - timestamp) > 30_000) {
		return NextResponse.json({ error: "Request expired" }, { status: 401 });
	}

	// the payload string must match exactly what the game signed
	const payload = `${name}:${score}:${timestamp}`;

	if (!verifySignature(payload, signature)) {
		return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
	}

	await db.insert(leaderboard).values({ username: name, time: score });

	return NextResponse.json({ ok: true });
}