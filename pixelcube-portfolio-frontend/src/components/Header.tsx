"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
                    <Image
                        src="/Images/pixelcube.png"
                        alt="PixelCube"
                        width={140}
                        height={36}
                        style={{ objectFit: "contain" }}
                        priority
                    />
                </Link>
                <nav className="nav">
                    <Link href="#contact">Contact</Link>
                </nav>
            </div>
        </header>
    );
}
