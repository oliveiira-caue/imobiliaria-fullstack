import { Geist } from "next/font/google";
import "./globals.css";
import DevWarningFilter from "./DevWarningFilter";

// Carrega apenas Geist Sans (remove Mono que não é usado no site público)
// display: swap evita FOIT — texto aparece imediatamente com fallback
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "Nexus Habitar — Imóveis em Belém do Pará",
  description: "Encontre o imóvel ideal em Belém do Pará. Apartamentos, casas e salas comerciais para venda e aluguel com busca inteligente por IA.",
  keywords: "imóveis Belém, apartamentos Belém, casas Belém, aluguel Belém, venda imóveis Pará",
  openGraph: {
    title: "Nexus Habitar — Imóveis em Belém do Pará",
    description: "Busque imóveis em Belém com inteligência artificial. Venda e aluguel.",
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DevWarningFilter />
        {children}
      </body>
    </html>
  );
}


