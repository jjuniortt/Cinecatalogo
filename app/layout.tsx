import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

export const metadata: Metadata = {
  title: "CineCatálogo — Filmes na Netflix",
  description:
    "Catálogo visual dos filmes disponíveis na Netflix no Brasil, com dados do TMDB.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${anton.variable} font-sans bg-base text-white`}
      >
        <Navbar />
        {children}
        <footer className="relative z-10 border-t border-white/5 px-6 py-10 text-center text-sm text-gray-500 md:px-12">
          <p>
            <span className="font-display tracking-wide text-gray-300">
              CINE<span className="text-netflix">CATÁLOGO</span>
            </span>
          </p>
          <p className="mt-2">
            Dados fornecidos por{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 underline-offset-2 hover:text-white hover:underline"
            >
              The Movie Database (TMDB)
            </a>
            . Este produto não é endossado pela Netflix.
          </p>
        </footer>
      </body>
    </html>
  );
}
