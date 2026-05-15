export default function ContactSection() {
    return (
        <section className="contact-section" id="contact">
            <div className="container">
                <div className="contact-inner">
                    <div className="contact-text">
                        <h2>
                            Let&apos;s <em>Connect</em>
                        </h2>
                        <p>
                            Have a project in mind? Let&apos;s create something extraordinary
                            together. Whether it&apos;s a brand identity, 3D visualization,
                            web application, or motion graphics — I bring creative vision to
                            every pixel.
                        </p>
                        <div className="contact-links">
                            <a
                                href="mailto:info@pixelcubestudio.com"
                                className="contact-link"
                            >
                                <svg
                                    className="contact-link-icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                info@pixelcubestudio.com
                            </a>
                            <a href="tel:+94773583377" className="contact-link">
                                <svg
                                    className="contact-link-icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                (+94) 77 358 3377
                            </a>
                            <a
                                href="https://www.instagram.com/pixelcubestudio"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-link"
                            >
                                <svg
                                    className="contact-link-icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                </svg>
                                @pixelcubestudio
                            </a>
                        </div>
                    </div>
                    <div className="contact-visual">
                        <div className="contact-decoration">
                            <svg
                                viewBox="0 0 280 280"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                {/* Abstract decorative shapes */}
                                <rect
                                    x="60"
                                    y="60"
                                    width="160"
                                    height="160"
                                    rx="20"
                                    stroke="rgba(255,255,255,0.08)"
                                    strokeWidth="1"
                                />
                                <rect
                                    x="90"
                                    y="90"
                                    width="100"
                                    height="100"
                                    rx="12"
                                    stroke="rgba(255,255,255,0.12)"
                                    strokeWidth="1"
                                    transform="rotate(15 140 140)"
                                />
                                <circle
                                    cx="140"
                                    cy="140"
                                    r="40"
                                    stroke="rgba(255,255,255,0.06)"
                                    strokeWidth="1"
                                />
                                <path
                                    d="M140 80L180 140L140 200L100 140Z"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="1"
                                    fill="rgba(255,255,255,0.01)"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
