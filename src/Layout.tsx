import Navbar from "./Components/Navbar";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: "Textura - Securely share texts online",
  description: "Securely share texts online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="px-5">
          {children}
          <Analytics />
          {/* <GoogleAnalytics /> */}
        </div>
      </body>
    </html>
  );
}
