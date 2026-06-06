"use client";

import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex flex-col sm:flex-row sm:gap-8">
			<p className="font-mono text-[10px] uppercase tracking-widest text-neutral-600 sm:w-32 shrink-0 pt-0.5">
				{label}
			</p>
			<p className="text-sm text-neutral-400">{value}</p>
		</div>
	);
}

export default function ImprintPage() {
	return (
		<div className="flex flex-col min-h-screen bg-[#1a1a1a] font-mono">
			<Header />

			<main className="flex-1 px-[8vw] py-16 max-w-3xl mx-auto w-full">

				<div className="mb-12">
					<p className="text-[10px] text-[#00ff00] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
						<span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] inline-block" />
						Impressum
					</p>
					<h1 className="text-4xl font-bold text-neutral-100 tracking-tight mb-2">
						Imprint
					</h1>
					<p className="text-sm text-neutral-500">
						Angaben gemäß § 25 MedienG und § 5 ECG
					</p>
				</div>

				<div className="flex flex-col gap-10">

					<section className="flex flex-col gap-4">
						<p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">
							Medieninhaber & Diensteanbieter
						</p>
						<Row label="Name"    value="[Name]" />
						<Row label="Adresse" value="[Straße], [PLZ] [Ort], Österreich" />
						<Row label="E-Mail"  value={
							<a href="mailto:contact@example.com" className="text-[#00ff00] hover:underline">
								contact@example.com
							</a>
						} />
					</section>

					<div className="border-t border-[#222]" />

					<section className="flex flex-col gap-4">
						<p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">
							Zweck
						</p>
						<Row
							label="Tätigkeit"
							value="Entwicklung und Vertrieb von Computerspielen (privat / nicht-kommerziell)"
						/>
					</section>

					<div className="border-t border-[#222]" />

					<section className="flex flex-col gap-4">
						<p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">
							Haftungsausschluss
						</p>
						<p className="text-sm text-neutral-500 leading-relaxed">
							Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung
							für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten
							sind ausschließlich deren Betreiber verantwortlich.
						</p>
					</section>

				</div>

			</main>

			<Footer />
		</div>
	);
}