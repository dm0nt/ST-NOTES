import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/Components/ThemeProvider";

// Cargamos las fuentes
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
  description: "Aplicación de notas con múltiples formatos",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light">
      <head>
        {/* Metaetiquetas para móviles */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />

        {/* Forzamos el color negro en elementos de texto */}
        <style>
          {`
            body, p, h1, h2, h3, h4, h5, h6, span, div, button, a, input, textarea, li, td, th {
              color: black !important;
            }
            
            /* Excepciones para botones con fondo de color */
            button.bg-pink-600 span, 
            button.bg-pink-600, 
            button.bg-pink-700 span, 
            button.bg-pink-700,
            .bg-pink-600 *,
            .bg-pink-700 * {
              color: white !important;
            }
            
            .text-pink-600 {
              color: #db2777 !important;
            }

            /* Forzar fondo claro */
            html, body {
              background-color: #ffffff !important;
            }
          `}
        </style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased light`}
        style={{ backgroundColor: "#ffffff" }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
