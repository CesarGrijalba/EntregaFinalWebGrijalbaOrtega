import type React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// 💎 Fuentes modernas (Geist + JetBrains Mono)
const geistSans = localFont({
  src: [
    {
      path: "../node_modules/geist/dist/fonts/geist-sans/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/geist/dist/fonts/geist-sans/Geist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: [
    {
      path: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
  display: "swap",
});

// 🧠 Metadatos globales
export const metadata: Metadata = {
  title: "QHuboCaq",
  description:
    "Portal de noticias locales y tecnológicas de Q'hubo Ibagué y el Caquetá. Un espacio de innovación periodística y contenido regional.",
  icons: {
    icon: "https://www.qhuboibague.com/wp-content/uploads/2021/10/cropped-Logo_Q_hubo.png",
  },
  themeColor: "#FFD100",
  generator: "Next.js + Supabase + Vercel",
};

// 🌈 Fondo dinámico tecnológico
const BackgroundEffect = () => (
  <div className="fixed inset-0 -z-10 bg-gradient-to-br from-yellow-100 via-white to-yellow-50 animate-gradient-x opacity-70"></div>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link
          rel="icon"
          href="https://www.qhuboibague.com/wp-content/uploads/2021/10/cropped-Logo_Q_hubo.png"
          type="image/png"
        />
        <title>QHuboCaq</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased relative overflow-x-hidden text-foreground`}
      >
        <BackgroundEffect />

        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>

        {/* 🔹 Footer institucional */}
        <footer className="border-t bg-gradient-to-r from-yellow-50 via-yellow-100/60 to-yellow-50 py-4 mt-12 text-center text-sm text-muted-foreground backdrop-blur-md">
          <p>
            © 2025 <strong>QHuboCaq</strong> · Desarrollado por{" "}
            <span className="text-primary font-semibold">
              César Grijalba & Ana Sofía Pérez
            </span>{" "}
            · Tecnología Supabase + Next.js
          </p>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
``
