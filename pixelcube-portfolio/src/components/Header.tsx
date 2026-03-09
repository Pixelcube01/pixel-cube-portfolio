"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`header ${scrolled ? "scrolled" : ""}`}>
            <div className="header-inner">
                <Link href="/" className="logo">
                    <div className="logo-icon">P</div>
                    <span>PixelCube</span>
                </Link>
                <nav className="nav">
                    <Link href="/" className="active">
                        Home
                    </Link>
                    <Link href="#projects">Projects</Link>
                    <Link href="#about">About</Link>
                    <Link href="#contact">Contact</Link>
                </nav>
            </div>
        </header>
    );
}
