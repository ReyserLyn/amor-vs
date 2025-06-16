import { Outfit } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import InstallButton from "@/components/install-button";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Amor RM",
  description: "Esta es una app para contar el amor de Reyser y Marilyn",
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>

      <body className={`${outfit.className} antialiased`}>
        <InstallButton />
        {children}
      </body>
    </html>
  );
}
