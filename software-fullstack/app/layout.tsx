import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="m-0 p-0 overflow-x-hidden bg-white">

        <div className="w-screen">
          <div className="h-[40px] bg-forge-maroon w-full"></div>
          <div className="h-[10px] bg-forge-darkblue w-full"></div>
        </div>

        <main>
          {children}
        </main>

        <div className="w-screen mt-[30px]">
          <div className="h-[10px] bg-forge-darkblue w-full"></div>
          <div className="h-[40px] bg-forge-maroon w-full"></div>
        </div>

      </body>
    </html>
  );
}