"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
    const pathname = usePathname()

    const linkClass = (href: string) =>
        `px-4 py-2 rounded-md text-sm transition-colors duration-150 ${
            pathname === href && pathname !== "/"
                ? "text-secondary bg-secondary/10 font-medium"
                : "text-primary dark:primary hover:text-primary hover:bg-primary/10"
        }`

    return (
        <footer className="w-full border-t border-background dark:border-background bg-background dark:bg-background backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Copyright */}
                <span className="text-sm text-primary/50">
                    © {new Date().getFullYear()} Imperium Linea Interface
                </span>

                {/* Nav links */}
                <nav className="flex items-center gap-1">
                    <Link href="/about" className={linkClass("/about")}>
                        About
                    </Link>
                    <div className="w-px h-4 bg-primary/20" />
                    <Link href="/imprint" className={linkClass("/imprint")}>
                        Imprint
                    </Link>
                </nav>

            </div>
        </footer>
    )
}