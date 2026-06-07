"use client";

import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export default function AboutPage() {
	return (
		<div className="flex flex-col min-h-screen bg-[#1a1a1a] font-mono">
			<Header />

			<main className="flex-1 px-[8vw] py-16 max-w-5xl mx-auto w-full">

				<div className="mb-12">
					<p className="text-[10px] text-[#00ff00] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
						<span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] inline-block" />
						Help
					</p>
				</div>

				<div className="flex flex-col gap-8 text-sm text-neutral-400 leading-relaxed">

					<section>
						<p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-3">The Commands</p>
						<div className="flex-row gap-y-10 gap-2">
							<div className="flex gap-32.5">
								<p>rotate</p>
								<p>Rotates the platform by 90°.</p>
							</div>
							<div className="flex gap-20">
								<p>rotate <em>angle</em></p>
								<p>Rotates the platform by <em>angle</em>°.</p>
							</div>
							<div className="flex items-center gap-16">
								<p>close-door <em>num</em></p>
								<p>Closes the door with number <em>num</em>.</p>
							</div>
							<div className="flex items-center gap-37">
								<p>help</p>
								<p>Prints a list of all available commands.</p>
							</div>
							<div className="flex items-center gap-20">
								<p>help <em>command</em></p>
								<p>Prints detailed information on <em>command</em></p>
							</div>
						</div>
					</section>

					<section>
						<p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-3">The Mechanics</p>
						<p>The goal of I.L.I is to spot and defeat Enemies to survive as long as possible.</p>
						<p>Enemies can spawn in either one of the two Hallways. To be able to check whether an Enemy has spawned the platform has to be rotated.</p>
						<p>Enemies move slowly towards the player and can only be stopped by closing the doors at the correct time.
						When they are in range of the Doors, Enemies get indicated with a white border. At that point the doors will be able to stop them.</p>
						<p>Doors have a 10s delay between being closed and being able to be closed again. Additionally doors will automatically reopen once closed.
						Both mechanics serve to preserve a balanced Experience</p>
					</section>
				</div>

			</main>

			<Footer />
		</div>
	);
}