"use client"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
    const pathname = usePathname()

    const linkClass = (href) =>
        `px-4 py-2 rounded-md text-sm transition-colors duration-150 ${
            pathname === href && pathname !== "/"
                ? "text-secondary bg-secondary/10 font-medium"
                : "text-primary dark:primary hover:text-primary hover:bg-primary/10"
        }`

    return (
        <header className="w-full border-b border-background dark:border-background bg-background dark:bg-background backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo / Title */}
                <Link href="/" className={linkClass("/")}>
                    <div className="flex items-center gap-2">
                        <Image src="/ILI.png" alt="Imperium Linea Interface logo" width={24} height={24} />
                        <span className="text-sm font-semibold tracking-widest uppercase text-zinc-800 dark:text-zinc-100">
                            I.L.I Imperium Linea Interface
                        </span>
                    </div>
                </Link>

                {/* Nav links */}
                <nav className="flex items-center gap-1">
                    <Link href="/install" className={linkClass("/install")}>
                        Install
                    </Link>
                    <div className="w-px h-4 bg-primary/20" />
                    <Link href="/leaderboard" className={linkClass("/leaderboard")}>
                        Leaderboard
                    </Link>
                </nav>

            </div>
        </header>
    )
}