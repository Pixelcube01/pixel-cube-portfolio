export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">
                <div className="hero-text">
                    <div className="hero-label">Creative Studio — 2025</div>
                    <h1 className="hero-title">
                        <em>Featured Projects</em>
                        <span>PixelCube</span>
                    </h1>
                    <p className="hero-description">
                        A multidisciplinary design studio crafting bold visuals, immersive
                        experiences, and pixel-perfect digital products. From 3D renders to
                        full-stack web applications.
                    </p>
                </div>
                <div className="hero-decoration">
                    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* 3D Cube Icon */}
                        <path
                            d="M60 10L105 35V85L60 110L15 85V35L60 10Z"
                            stroke="white"
                            strokeWidth="1.5"
                            fill="none"
                        />
                        <path d="M60 10L60 110" stroke="white" strokeWidth="0.5" opacity="0.5" />
                        <path d="M15 35L105 85" stroke="white" strokeWidth="0.5" opacity="0.3" />
                        <path d="M105 35L15 85" stroke="white" strokeWidth="0.5" opacity="0.3" />
                        <path
                            d="M60 10L105 35L60 60L15 35L60 10Z"
                            stroke="white"
                            strokeWidth="1"
                            fill="rgba(255,255,255,0.03)"
                        />
                        <path
                            d="M60 60L105 35V85L60 110V60Z"
                            stroke="white"
                            strokeWidth="1"
                            fill="rgba(255,255,255,0.02)"
                        />
                        <path
                            d="M60 60L15 35V85L60 110V60Z"
                            stroke="white"
                            strokeWidth="1"
                            fill="rgba(255,255,255,0.01)"
                        />
                    </svg>
                </div>
            </div>
        </section>
    );
}
