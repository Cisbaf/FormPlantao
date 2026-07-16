import type { Metadata } from "next";
import DateProvider from "./DateProvider";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Plantão SAMU - Formulários",
  description: "Gerenciamento de Plantões e Formulários de Frequência",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
    >
      <body className="min-h-full flex flex-col">
        <DateProvider>
          <Providers>{children}</Providers>
        </DateProvider>
      </body>
    </html>
  );
}
