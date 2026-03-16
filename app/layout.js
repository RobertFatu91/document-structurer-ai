import Script from "next/script";

export const metadata = {
  title: "Document Structurer AI",
  description: "Turn messy notes into structured summaries instantly."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WZ5ZDMX4DW"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WZ5ZDMX4DW');
          `}
        </Script>

      </head>

      <body>
        {children}
      </body>

    </html>
  );
}