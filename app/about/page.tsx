"use client";

import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export default function AboutPage() {
	return (
		<div className="flex flex-col min-h-screen bg-[#1a1a1a] font-mono">
			<Header />

			<main className="flex-1 px-[8vw] py-16 max-w-3xl mx-auto w-full">

				<div className="mb-12">
					<p className="text-[10px] text-[#00ff00] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
						<span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] inline-block" />
						About
					</p>
					<h1 className="text-4xl font-bold text-neutral-100 tracking-tight mb-2">
						Imperium Linea Interface
					</h1>
					<p className="text-sm text-neutral-500">
						A CLI-based horror game. Watch out or you might type your last commands.
					</p>
				</div>

				<div className="flex flex-col gap-8 text-sm text-neutral-400 leading-relaxed">

					<section>
						<p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-3">The Game</p>
						<p>
							I.L.I. is a horror game built around using a terminal to survive. The terminal is your only way to interact with the environment. Use commands to defend yourself. Watch out for monsters as they try to reach you. Survive for as long as you can. Don't let them catch you.
						</p>
					</section>

					<section>
						<p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-3">The Team</p>
						<p>
							Made by Imperium Linea Company Ltd., all rights reserved.						</p>
					</section>

					<section>
						<p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-3">Contact</p>
						<p>
							For inquiries/bug reports, reach us at contact@ili.com
						</p>
					</section>

				</div>

			</main>

			<Footer />
		</div>
	);
}