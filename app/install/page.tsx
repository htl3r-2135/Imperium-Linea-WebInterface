"use client";

import {useState} from "react";
import Header from "@/app/components/header";

//TBD, wer auch immer buildet soll dann die URLs und File-Namen updaten, dange
const DOWNLOAD_URL = "/downloads/ILI.exe";
const DOWNLOAD_FILENAME = "ILI.exe";

export default function InstallPage() {
    const [showModal, setShowModal] = useState(false);
    const [showReqs, setShowReqs] = useState(false);

    function handleDownload() {
        const link = document.createElement("a");
        link.href = DOWNLOAD_URL;
        link.download = DOWNLOAD_FILENAME;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowModal(false);
    }

    return (
        <>
            <div className="flex flex-col flex-1 items-center justify-center bg-background font-sans">
                <Header/>
                <main className="flex items-center min-h-[calc(100vh-56px)] px-[10vw] bg-[#1a1a1a]">
                    <div className="grid grid-cols-2 gap-16 w-full items-center">

                        <div>
                            <p className="font-mono text-[11px] text-green-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"/>
                                Sprint 3
                            </p>
                            <h1 className="text-3xl font-bold text-neutral-100 leading-tight tracking-tight mb-3">
                                Imperium Linea<br/>Interface
                            </h1>
                            <p className="text-sm text-neutral-500 leading-relaxed mb-7 max-w-sm">
                                Terminals in einem neuen Licht
                            </p>

                            <div className="flex items-center gap-3 mb-5">
                                <button onClick={() => setShowModal(true)} className="bg-green-500 hover:bg-green-400 text-black text-sm font-bold tracking-wide px-6 py-2.5 rounded-md transition-colors cursor-pointer">Download .exe</button>
                                <button onClick={() => setShowReqs(!showReqs)} className="border border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600 text-sm px-4 py-2.5 rounded-md transition-colors cursor-pointer">System requirements</button>
                            </div>

                            {showReqs && (
                                <div className="bg-[#111] border border-[#222] rounded-lg px-4 py-3 mb-5 max-w-sm">
                                    <p className="font-mono text-[11px] text-neutral-600 uppercase tracking-widest mb-2">Requirements</p>
                                    <ul className="text-sm text-neutral-500 space-y-1">
                                        <li className="flex justify-between"><span>OS</span><span
                                            className="text-neutral-400">Windows 11</span></li>
                                        <li className="flex justify-between"><span>RAM</span><span
                                            className="text-neutral-400">TBD</span></li>
                                        <li className="flex justify-between"><span>Disk</span><span
                                            className="text-neutral-400">TBD</span></li>
                                        <li className="flex justify-between"><span>Graphics</span><span
                                            className="text-neutral-400">TBD</span></li>
                                    </ul>
                                </div>
                            )}

                            <div className="flex gap-5">
                                {[
                                    ["OS", "Windows 11"],
                                    ["Size", "N/A"],
                                    ["Team", `Eisenstadt`],
                                ].map(([label, value]) => (
                                    <p key={label} className="font-mono text-[11px] text-neutral-600">
                                        {label}: <span className="text-neutral-500">{value}</span>
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div
                                className="bg-[#111] border border-[#222] rounded-xl w-full aspect-square flex flex-col items-center justify-center gap-3 mb-4">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-15">
                                    <rect x="8" y="8" width="14" height="14" rx="2" fill="white"/>
                                    <rect x="26" y="8" width="14" height="14" rx="2" fill="white"/>
                                    <rect x="8" y="26" width="14" height="14" rx="2" fill="white"/>
                                    <rect x="26" y="26" width="14" height="14" rx="2" fill="white" opacity="0.4"/>
                                </svg>
                                <p className="font-mono text-[11px] text-neutral-700">Placeholder (maybe logo, terminal or windows logo, idk)</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-xl p-8 w-105 max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold text-neutral-100 mb-2">Download I.L.I.</h2>

                        <div className="flex items-center gap-4 bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3.5 mb-7">
                            <span className="text-green-400 text-xl">⬇</span>
                            <div>
                                <p className="text-sm font-semibold text-neutral-300 font-mono mb-0.5">{DOWNLOAD_FILENAME}</p>
                                <p className="text-xs text-neutral-600">Windows Installer · ~120 MB</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2.5">
                            <button onClick={() => setShowModal(false)} className="border border-neutral-700 text-neutral-500 hover:text-neutral-300 hover:border-neutral-500 text-sm px-5 py-2 rounded-md transition-colors cursor-pointer">Cancel</button>
                            <button onClick={handleDownload} className="bg-green-500 hover:bg-green-400 text-black text-sm font-bold px-5 py-2 rounded-md transition-colors cursor-pointer">Download</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}