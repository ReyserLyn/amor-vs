import type { Metadata } from "next";
import { Outfit } from 'next/font/google'
import "./globals.css";

const outfit = Outfit({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700', '800', '900'],
	adjustFontFallback: true,
})
export const metadata: Metadata = {
  title: "Amor RM",
  description: "Esta es una app para contar el amor de Reyser y Marilyn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${outfit.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
