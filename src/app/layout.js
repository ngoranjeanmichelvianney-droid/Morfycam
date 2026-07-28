import { Instrument_Serif, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "MorfyCam — Transformation faciale en direct",
  description: "Change de visage en temps réel pendant tes lives, appels et vidéos.",
  openGraph: {
    title: "MorfyCam — Transformation faciale en direct",
    description: "Change de visage en temps réel pendant tes lives, appels et vidéos.",
    url: "https://morfycam.com",
    siteName: "MorfyCam",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "MorfyCam",
              url: "https://morfycam.com",
              logo: "https://morfycam.com/logos/L7.jpeg",
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MorfyCam",
              url: "https://morfycam.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://morfycam.com/dashboard?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${instrumentSerif.variable} ${workSans.variable} ${plexMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}