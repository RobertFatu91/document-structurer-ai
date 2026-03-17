import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Document Structurer AI",
  description: "AI Notes, Email and Meeting Assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}