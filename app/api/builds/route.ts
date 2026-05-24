import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual, createHash } from "crypto";
import fs from "fs/promises";
import path from "path";

const SECRET = process.env.HMAC_SECRET!;

const UPLOAD_ROOT =
	process.env.BUILD_STORAGE ??
	path.join(process.cwd(), "uploads");

const MAX_AGE_SECONDS = 300;

function hmacFile(buffer: Buffer): string {
	return createHmac("sha256", SECRET)
		.update(buffer)
		.digest("hex");
}

function sha256(buffer: Buffer): string {
	return createHash("sha256")
		.update(buffer)
		.digest("hex");
}

function safeEqual(a: string, b: string): boolean {
	try {
		return timingSafeEqual(
			Buffer.from(a, "hex"),
			Buffer.from(b, "hex")
		);
	} catch {
		return false;
	}
}

export async function POST(req: NextRequest) {
	try {
		const signature =
			req.headers.get("X-Signature-HMAC-SHA256");

		if (!signature) {
			return NextResponse.json(
				{ error: "Missing signature" },
				{ status: 401 }
			);
		}

		const form = await req.formData();

		const file = form.get("file") as File | null;
		const metadataRaw = form.get("metadata") as string | null;

		if (!file || !metadataRaw) {
			return NextResponse.json(
				{ error: "Missing fields" },
				{ status: 400 }
			);
		}

		const metadata = JSON.parse(metadataRaw);

		const {
			product,
			version,
			platform,
			sha256: expectedSha256,
			timestamp,
		} = metadata;

		// ------------------------------------------------------------------
		// Replay protection
		// ------------------------------------------------------------------

		const now = Math.floor(Date.now() / 1000);

		if (Math.abs(now - timestamp) > MAX_AGE_SECONDS) {
			return NextResponse.json(
				{ error: "Request expired" },
				{ status: 401 }
			);
		}

		// ------------------------------------------------------------------
		// Read file
		// ------------------------------------------------------------------

		const buffer = Buffer.from(await file.arrayBuffer());

		// ------------------------------------------------------------------
		// Verify HMAC
		// ------------------------------------------------------------------

		const expectedHmac = hmacFile(buffer);

		if (!safeEqual(signature, expectedHmac)) {
			return NextResponse.json(
				{ error: "Invalid HMAC signature" },
				{ status: 401 }
			);
		}

		// ------------------------------------------------------------------
		// Verify SHA256
		// ------------------------------------------------------------------

		const actualSha256 = sha256(buffer);

		if (actualSha256 !== expectedSha256) {
			return NextResponse.json(
				{ error: "SHA256 mismatch" },
				{ status: 400 }
			);
		}

		// ------------------------------------------------------------------
		// Validate platform
		// ------------------------------------------------------------------

		const allowedPlatforms = [
			"windows",
			"linux",
			"macos",
		];

		if (!allowedPlatforms.includes(platform)) {
			return NextResponse.json(
				{ error: "Invalid platform" },
				{ status: 400 }
			);
		}

		// ------------------------------------------------------------------
		// Create directories
		// ------------------------------------------------------------------

		const targetDir = path.join(
			UPLOAD_ROOT,
			product,
			version,
			platform
		);

		await fs.mkdir(targetDir, { recursive: true });

		// ------------------------------------------------------------------
		// Save file
		// ------------------------------------------------------------------

		const safeFilename = path.basename(file.name);

		const filePath = path.join(
			targetDir,
			safeFilename
		);

		await fs.writeFile(filePath, buffer);

		// ------------------------------------------------------------------
		// Save metadata
		// ------------------------------------------------------------------

		await fs.writeFile(
			path.join(targetDir, "metadata.json"),
			JSON.stringify(metadata, null, 2)
		);

		console.log("[Build Upload]");
		console.log("Product:", product);
		console.log("Version:", version);
		console.log("Platform:", platform);
		console.log("File:", safeFilename);

		return NextResponse.json({
			ok: true,
			product,
			version,
			platform,
			file: safeFilename,
		});
	} catch (err) {
		console.error(err);

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}