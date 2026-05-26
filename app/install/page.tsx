"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/header";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlatformRelease {
    platform: string;
    filename: string;
    size: number;
    sha256: string;
    timestamp: number;
    downloadUrl: string;
}

interface VersionRelease {
    product: string;
    version: string;
    platforms: PlatformRelease[];
    latestTimestamp: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
    if (!bytes) return "N/A";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

type DetectedOS = "windows" | "linux" | "other";

function detectOS(): DetectedOS {
    if (typeof navigator === "undefined") return "other";
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("windows")) return "windows";
    if (ua.includes("linux") && !ua.includes("android")) return "linux";
    return "other";
}

const PLATFORM_META: Record<string, { label: string; ext: string; icon: React.ReactNode }> = {
    windows: {
        label: "Windows",
        ext: ".exe",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
            </svg>
        ),
    },
    linux: {
        label: "Linux",
        ext: ".tar.gz",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.544-.209.276-.209.619-.081.988.141.4.391.775.673 1.067.27.282.544.42.772.38l.032-.007c.176-.021.344-.109.465-.281.12-.172.16-.397.148-.629-.016-.228-.075-.462-.18-.671-.104-.206-.256-.4-.437-.517-.143-.088-.282-.134-.393-.117a.438.438 0 01-.162-.022c-.069-.024-.135-.073-.208-.166-.114-.146-.222-.349-.322-.576l-.005-.013c-.071-.166-.13-.337-.173-.513a2.153 2.153 0 01-.063-.52c-.001-.121.005-.238.019-.351.074-.575.348-1.073.729-1.465.379-.392.863-.675 1.375-.861.512-.187 1.044-.274 1.543-.35a14.52 14.52 0 001.376-.26c.37-.1.705-.231.985-.416.28-.184.5-.42.617-.72.117-.302.118-.655-.005-1.045-.123-.39-.39-.734-.769-1.016a3.908 3.908 0 00-.61-.346 1.968 1.968 0 00-.38-.112c-.135-.027-.27-.032-.402-.013a1.7 1.7 0 00-.706.292 2.42 2.42 0 00-.508.533c-.134.195-.235.41-.296.636-.06.225-.08.46-.046.686a.82.82 0 00.134.344c.07.1.16.175.255.224a.76.76 0 00.29.075c.1.005.2-.01.291-.046.09-.037.17-.095.228-.174.06-.08.093-.18.093-.294 0-.117-.033-.246-.103-.376a.868.868 0 00-.252-.3.57.57 0 00-.314-.107c-.113-.003-.22.03-.31.095a.534.534 0 00-.188.254.582.582 0 00-.034.312c.028.1.09.19.173.255a.5.5 0 00.27.1c.09.006.175-.012.248-.053.073-.04.13-.1.163-.174a.44.44 0 00.033-.24.43.43 0 00-.111-.215.413.413 0 00-.207-.12.414.414 0 00-.245.014.42.42 0 00-.183.142.434.434 0 00-.074.226.45.45 0 00.051.23c.05.07.12.12.2.143a.45.45 0 00.247.001.468.468 0 00.209-.127.493.493 0 00.116-.233.52.52 0 00-.016-.264.55.55 0 00-.166-.228.584.584 0 00-.265-.124.623.623 0 00-.298.028.665.665 0 00-.258.175.715.715 0 00-.152.288.77.77 0 00.005.327c.045.11.12.205.214.272a.827.827 0 00.315.131c.118.021.243.013.361-.025a.901.901 0 00.316-.181.97.97 0 00.21-.316 1.062 1.062 0 00.062-.395 1.17 1.17 0 00-.107-.44 1.293 1.293 0 00-.274-.384 1.456 1.456 0 00-.41-.26 1.648 1.648 0 00-.51-.1 1.876 1.876 0 00-.552.065 2.15 2.15 0 00-.54.236 2.49 2.49 0 00-.468.42 2.9 2.9 0 00-.347.59 3.4 3.4 0 00-.192.735 4.01 4.01 0 00.02.86c.07.297.193.578.365.83C3.44 17.04 3.68 17.253 3.949 17.41c.27.157.569.257.88.291.311.034.632-.003.94-.113a2.76 2.76 0 00.816-.499c.233-.207.433-.455.585-.731.153-.276.257-.578.302-.895a3.49 3.49 0 00-.04-1.007 3.97 3.97 0 00-.352-.982 4.558 4.558 0 00-.624-.889A5.23 5.23 0 005.6 12.66c-.3-.23-.62-.427-.95-.58a5.55 5.55 0 00-1.017-.33 5.828 5.828 0 00-1.047-.091c-.353.005-.703.05-1.045.141a5.985 5.985 0 00-.976.362 6.13 6.13 0 00-.872.567 6.22 6.22 0 00-.73.749 6.254 6.254 0 00-.554.912 6.228 6.228 0 00-.352 1.05 6.166 6.166 0 00-.12 1.16c.005.392.054.78.148 1.155a6.04 6.04 0 00.377 1.086 5.882 5.882 0 00.59.975 5.699 5.699 0 00.789.835 5.514 5.514 0 00.963.66 5.325 5.325 0 001.108.455 5.15 5.15 0 001.22.207 5.004 5.004 0 001.3-.075 4.89 4.89 0 001.341-.433 4.81 4.81 0 001.336-.832 4.76 4.76 0 001.278-1.76 4.755 4.755 0 00.256-2.012 4.79 4.79 0 00-.547-1.838 4.866 4.866 0 00-1.14-1.492 4.988 4.988 0 00-1.608-.929 5.154 5.154 0 00-1.907-.235c-.653.04-1.296.222-1.876.532a5.386 5.386 0 00-1.457 1.126 5.587 5.587 0 00-.963 1.597 5.782 5.782 0 00-.333 1.912c.003.66.115 1.314.333 1.934.218.62.54 1.197.957 1.706a6.062 6.062 0 001.464 1.353 6.37 6.37 0 001.865.79 6.718 6.718 0 002.12.164 7.07 7.07 0 002.191-.578 7.4 7.4 0 001.936-1.283 7.687 7.687 0 001.51-1.876 7.916 7.916 0 00.777-2.33 8.075 8.075 0 00-.016-2.596 8.153 8.153 0 00-.784-2.387 8.157 8.157 0 00-1.49-2.003 8.07 8.07 0 00-2.104-1.46 7.883 7.883 0 00-2.562-.68 7.6 7.6 0 00-2.726.25 7.216 7.216 0 00-2.458 1.19 6.733 6.733 0 00-1.812 1.942 6.148 6.148 0 00-.803 2.522 5.48 5.48 0 00.312 2.857 4.748 4.748 0 001.604 2.126 3.97 3.97 0 002.441.771 3.19 3.19 0 002.191-.954 2.436 2.436 0 00.628-2.217 1.705 1.705 0 00-1.197-1.305 1.003 1.003 0 00-1.16.65.61.61 0 00.334.78.3.3 0 00.38-.184.19.19 0 00-.12-.24.09.09 0 01-.064-.112.09.09 0 01.112-.064c.166.053.278.22.258.393a.426.426 0 01-.543.343.737.737 0 01-.467-.951 1.122 1.122 0 011.348-.752c.64.19 1.034.842.928 1.499a2.617 2.617 0 01-1.035 1.737 3.378 3.378 0 01-2.174.631 4.156 4.156 0 01-2.24-.826 4.945 4.945 0 01-1.527-2.013 5.656 5.656 0 01-.348-2.742c.12-.96.46-1.888.99-2.706a6.41 6.41 0 011.938-1.955 6.884 6.884 0 012.672-1.015 7.28 7.28 0 012.976.22 7.6 7.6 0 012.657 1.347 7.847 7.847 0 011.977 2.21 7.993 7.993 0 00-4.83-10.966 7.954 7.954 0 00-2.948-.35zM12.4 1.5c.38.005.77.056 1.15.153a7.01 7.01 0 012.602 1.268 7.272 7.272 0 011.856 2.074 7.462 7.462 0 01.856 2.696 7.573 7.573 0 01-.177 2.902 7.615 7.615 0 01-1.117 2.564 7.59 7.59 0 01-1.918 1.977 7.506 7.506 0 01-2.488 1.107 7.368 7.368 0 01-2.764.077 7.192 7.192 0 01-2.605-.985 7.001 7.001 0 01-2.003-1.91 6.814 6.814 0 01-1.05-2.65 6.644 6.644 0 01.17-2.906 6.5 6.5 0 011.248-2.607 6.393 6.393 0 012.086-1.854A6.33 6.33 0 0112.4 1.5z" />
            </svg>
        ),
    },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function PlatformCard({
                          release,
                          platform,
                          isDetected,
                          onDownload,
                      }: {
    release: PlatformRelease;
    platform: string;
    isDetected: boolean;
    onDownload: (p: PlatformRelease) => void;
}) {
    const meta = PLATFORM_META[platform] ?? {
        label: platform,
        ext: "",
        icon: null,
    };

    return (
        <div
            className={`relative border rounded-xl p-5 transition-all duration-200 ${
                isDetected
                    ? "border-[#00ff00]/40 bg-[#00ff00]/[0.04]"
                    : "border-[#2a2a2a] bg-[#171717]"
            }`}
        >
            {isDetected && (
                <span className="absolute top-4 right-4 font-mono text-[10px] text-[#00ff00] uppercase tracking-widest bg-[#00ff00]/10 px-2 py-0.5 rounded-sm">
                    Detected
                </span>
            )}

            <div className="flex items-center gap-3 mb-4">
                <span className={isDetected ? "text-[#00ff00]" : "text-neutral-500"}>
                    {meta.icon}
                </span>
                <div>
                    <p className="text-sm font-semibold text-neutral-200 font-mono">{meta.label}</p>
                    <p className="text-[11px] text-neutral-600 font-mono">{meta.ext}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-5">
                {[
                    ["File",    release.filename],
                    ["Size",    formatBytes(release.size)],
                    ["Updated", formatDate(release.timestamp)],
                ].map(([k, v]) => (
                    <div key={k}>
                        <p className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">{k}</p>
                        <p className="font-mono text-[11px] text-neutral-400 truncate" title={v}>{v}</p>
                    </div>
                ))}
            </div>

            <button
                onClick={() => onDownload(release)}
                className={`w-full py-2 rounded-md text-sm font-bold font-mono tracking-wide transition-colors cursor-pointer ${
                    isDetected
                        ? "bg-[#00ff00] hover:bg-[#33ff33] text-black"
                        : "border border-[#2a2a2a] text-neutral-500 hover:text-neutral-200 hover:border-neutral-500"
                }`}
            >
                Download
            </button>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InstallPage() {
    const [releases,    setReleases]    = useState<VersionRelease[]>([]);
    const [loading,     setLoading]     = useState(true);
    const [fetchError,  setFetchError]  = useState(false);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [detectedOS,  setDetectedOS]  = useState<DetectedOS>("other");

    useEffect(() => {
        setDetectedOS(detectOS());
        fetch("/api/downloads")
            .then((r) => {
                if (!r.ok) throw new Error("fetch failed");
                return r.json() as Promise<VersionRelease[]>;
            })
            .then((data) => {
                setReleases(data);
            })
            .catch(() => setFetchError(true))
            .finally(() => setLoading(false));
    }, []);

    function handleDownload(p: PlatformRelease) {
        const link = document.createElement("a");
        link.href = p.downloadUrl;
        link.download = p.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const selected = releases[selectedIdx] ?? null;

    return (
        <>
            <div className="flex flex-col min-h-screen bg-[#1a1a1a] font-mono">
                <Header />

                <main className="flex-1 px-[8vw] py-16 max-w-5xl mx-auto w-full">

                    {/* ── Header block ── */}
                    <div className="mb-12">
                        <p className="text-[10px] text-[#00ff00] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] inline-block animate-pulse" />
                            Imperium Linea Interface
                        </p>
                        <h1 className="text-4xl font-bold text-neutral-100 tracking-tight mb-2">
                            Downloads
                        </h1>
                        <p className="text-sm text-neutral-500">
                            Select a version and platform to download the installer.
                        </p>
                    </div>

                    {/* ── States ── */}
                    {loading && (
                        <div className="flex items-center gap-3 text-neutral-600 text-sm">
                            <span className="w-4 h-4 border border-neutral-700 border-t-[#00ff00] rounded-full animate-spin" />
                            Fetching releases…
                        </div>
                    )}

                    {fetchError && (
                        <div className="border border-red-900/50 bg-red-950/20 rounded-xl px-5 py-4 text-sm text-red-400">
                            Failed to fetch releases from <code>/api/downloads</code>. Please try again later.
                        </div>
                    )}

                    {!loading && !fetchError && releases.length === 0 && (
                        <div className="border border-[#2a2a2a] rounded-xl px-5 py-4 text-sm text-neutral-500">
                            No releases available yet.
                        </div>
                    )}

                    {!loading && !fetchError && releases.length > 0 && (
                        <div className="flex flex-col gap-10">

                            {/* ── Version picker ── */}
                            <section>
                                <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-3">Version</p>
                                <div className="flex flex-wrap gap-2">
                                    {releases.map((r, i) => (
                                        <button
                                            key={r.version}
                                            onClick={() => setSelectedIdx(i)}
                                            className={`px-4 py-1.5 rounded-md text-xs font-mono tracking-wide border transition-colors cursor-pointer ${
                                                i === selectedIdx
                                                    ? "border-[#00ff00]/50 text-[#00ff00] bg-[#00ff00]/5"
                                                    : "border-[#2a2a2a] text-neutral-500 hover:text-neutral-300 hover:border-neutral-600"
                                            }`}
                                        >
                                            v{r.version}
                                            {i === 0 && (
                                                <span className="ml-2 text-[9px] bg-[#00ff00]/15 text-[#00ff00] px-1.5 py-0.5 rounded-sm uppercase">
                                                    latest
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* ── Platform cards ── */}
                            {selected && (
                                <section>
                                    <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-3">Platform</p>

                                    {selected.platforms.length === 0 ? (
                                        <p className="text-sm text-neutral-600">No platform builds available for this version.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {selected.platforms.map((p) => (
                                                <PlatformCard
                                                    key={p.platform}
                                                    release={p}
                                                    platform={p.platform}
                                                    isDetected={p.platform === detectedOS}
                                                    onDownload={(pl) => handleDownload(pl)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* ── Changelog stub ── */}
                            {selected && (
                                <section>
                                    <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-3">Release info</p>
                                    <div className="border border-[#222] rounded-xl px-5 py-4 text-sm">
                                        <div className="flex flex-wrap gap-6 text-neutral-500">
                                            <span>
                                                Product:{" "}
                                                <span className="text-neutral-300">{selected.product}</span>
                                            </span>
                                            <span>
                                                Version:{" "}
                                                <span className="text-neutral-300">v{selected.version}</span>
                                            </span>
                                            <span>
                                                Released:{" "}
                                                <span className="text-neutral-300">{formatDate(selected.latestTimestamp)}</span>
                                            </span>
                                            <span>
                                                Platforms:{" "}
                                                <span className="text-neutral-300">{selected.platforms.length}</span>
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </main>
            </div>

        </>
    );
}