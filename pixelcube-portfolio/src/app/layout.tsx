import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixelCube — Creative Digital Studio",
  description:
    "Premium portfolio showcasing 3D design, branding, motion graphics, UI/UX, and web development — powered by PixelCube Studio.",
  keywords: [
    "PixelCube",
    "portfolio",
    "design studio",
    "3D design",
    "branding",
    "motion graphics",
    "UI/UX",
    "web development",
  ],
  openGraph: {
    title: "PixelCube — Creative Digital Studio",
    description:
      "Premium portfolio showcasing creative design, branding, and development work.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="page-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
