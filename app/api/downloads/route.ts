import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const UPLOAD_ROOT =
	process.env.BUILD_STORAGE ?? path.join(process.cwd(), "uploads");

export interface PlatformRelease {
	platform: string;
	filename: string;
	size: number;           // bytes
	sha256: string;
	timestamp: number;      // unix seconds
	downloadUrl: string;
}

export interface VersionRelease {
	product: string;
	version: string;
	platforms: PlatformRelease[];
	latestTimestamp: number;
}

async function fileSize(filePath: string): Promise<number> {
	try {
		const stat = await fs.stat(filePath);
		return stat.size;
	} catch {
		return 0;
	}
}

export async function GET() {
	try {
		const releases: VersionRelease[] = [];

		// Walk: uploads/{product}/{version}/{platform}/metadata.json
		const products = await fs.readdir(UPLOAD_ROOT).catch(() => [] as string[]);

		for (const product of products) {
			const productDir = path.join(UPLOAD_ROOT, product);
			const stat = await fs.stat(productDir).catch(() => null);
			if (!stat?.isDirectory()) continue;

			const versions = await fs.readdir(productDir).catch(() => [] as string[]);

			for (const version of versions) {
				const versionDir = path.join(productDir, version);
				const vStat = await fs.stat(versionDir).catch(() => null);
				if (!vStat?.isDirectory()) continue;

				const platforms = await fs.readdir(versionDir).catch(() => [] as string[]);
				const platformReleases: PlatformRelease[] = [];

				for (const platform of platforms) {
					const platformDir = path.join(versionDir, platform);
					const metaPath = path.join(platformDir, "metadata.json");

					let meta: Record<string, unknown>;
					try {
						meta = JSON.parse(await fs.readFile(metaPath, "utf-8"));
					} catch {
						continue;
					}

					const filename = meta.filename as string;
					const filePath = path.join(platformDir, filename);
					const size = await fileSize(filePath);

					platformReleases.push({
						platform,
						filename,
						size,
						sha256: meta.sha256 as string,
						timestamp: meta.timestamp as number,
						// URL the browser will hit to download the file
						downloadUrl: `/api/downloads/${encodeURIComponent(product)}/${encodeURIComponent(version)}/${encodeURIComponent(platform)}/${encodeURIComponent(filename)}`,
					});
				}

				if (platformReleases.length === 0) continue;

				releases.push({
					product,
					version,
					platforms: platformReleases.sort((a, b) =>
						a.platform.localeCompare(b.platform)
					),
					latestTimestamp: Math.max(...platformReleases.map(p => p.timestamp)),
				});
			}
		}

		// Newest version first
		releases.sort((a, b) => b.latestTimestamp - a.latestTimestamp);

		return NextResponse.json(releases);
	} catch (err) {
		console.error("[Downloads API]", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}