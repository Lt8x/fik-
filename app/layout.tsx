import "./globals.css";

export const metadata = {
  title: "Fiká",
  description: "Arrive.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-white text-white">
        {children}
      </body>
    </html>
  );
}
