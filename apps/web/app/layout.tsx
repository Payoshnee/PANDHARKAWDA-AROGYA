import "./globals.css";
import { AppChrome } from "../components/Layout";
import { Providers } from "../components/Providers";

export const metadata = {
  title: "Pandharkawda Arogya",
  description: "Verified bilingual healthcare information for Pandharkawda."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Providers><AppChrome>{children}</AppChrome></Providers></body></html>;
}
