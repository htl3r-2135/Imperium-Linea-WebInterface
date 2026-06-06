import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export default function Home() {
	return (<div className="flex flex-col min-h-screen bg-black font-sans">
			<Header/>

			{/* Hero — full-viewport video */}
			<section className="relative flex flex-1 items-center justify-center min-h-screen overflow-hidden">

				{/* Video background */}
				<video
					className="absolute inset-0 w-full h-full object-cover opacity-60"
					src="/videos/game_intro.mp4"
					autoPlay
					muted
					loop
					playsInline
				/>

				{/* Gradient overlay — bottom fade into page */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black"/>

				{/* Hero content */}
				<div className="relative z-10 flex flex-col items-center text-center px-6 gap-6 max-w-2xl">
					<h1
						className="text-6xl sm:text-8xl font-bold tracking-tight text-white uppercase"
						style={{fontFamily: "'Georgia', serif", letterSpacing: "0.08em"}}
					>
						I.L.I
					</h1>

					<p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-lg">
						Something is watching through the terminal.
						Do not let the process finish.
					</p>

					<div className="flex flex-col sm:flex-row gap-3 mt-2">
						<a
							href="/install"
							className="px-8 py-3 bg-white text-black text-sm font-semibold uppercase tracking-widest hover:bg-white/90 transition-colors"
						>
							Play Now
						</a>
						<a
							href="/about"
							className="px-8 py-3 border border-white/40 text-white text-sm font-semibold uppercase tracking-widest hover:bg-white/10 transition-colors"
						>
							Learn More
						</a>
					</div>
				</div>
			</section>
			<Footer/>
		</div>);
}