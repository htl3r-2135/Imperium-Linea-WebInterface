import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const UPLOAD_ROOT =
	process.env.BUILD_STORAGE ?? path.join(process.cwd(), "uploads");

interface Params {
	product: string;
	version: string;
	platform: string;
	filename: string;
}

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<Params> }
) {
	const { product, version, platform, filename } = await params;

	const safe = [product, version, platform, filename].every(
		(p) => !p.includes("..") && !p.includes("/") && !p.includes("\\")
	);
	if (!safe) {
		return NextResponse.json({ error: "Invalid path" }, { status: 400 });
	}

	const filePath = path.join(UPLOAD_ROOT, product, version, platform, filename);

	let arrayBuffer: ArrayBuffer;
	let byteLength: number;
	try {
		const buffer = await fs.readFile(filePath);
		arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
		byteLength  = buffer.byteLength;
	} catch {
		return NextResponse.json({ error: "File not found" }, { status: 404 });
	}

	return new NextResponse(arrayBuffer, {
		headers: {
			"Content-Type":        "application/octet-stream",
			"Content-Disposition": `attachment; filename="${filename}"`,
			"Content-Length":      byteLength.toString(),
		},
	});
}