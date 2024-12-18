import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./compoents/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./compoents/Footer";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Attendance Management System",
  description: "Attendance Management System  ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        <AuthProvider>
          <Navbar />
          <main className="flex flex-col min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
