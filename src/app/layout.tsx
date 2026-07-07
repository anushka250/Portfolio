import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anushka Mall | Premium Graphic Designer",
  description: "Portfolio of Anushka Mall, a premium Graphic Designer and Visual Storyteller.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script src="https://unpkg.com/@phosphor-icons/web" defer></script>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
