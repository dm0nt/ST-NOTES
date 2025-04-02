import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ST-NOTES",
  description: "Aplicación de notas ST",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Estilos en línea para forzar el color negro en todo el texto */}
        <style>
          {`
            body, p, h1, h2, h3, h4, h5, h6, span, div, button, a, input, textarea, li, td, th {
              color: black !important;
            }
            
            /* Excepciones específicas para elementos que necesitan otro color */
            button.bg-pink-600 span, button.bg-pink-600, button.bg-pink-700 span, button.bg-pink-700 {
              color: white !important;
            }
            
            .text-pink-600 {
              color: #db2777 !important;
            }
          `}
        </style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
