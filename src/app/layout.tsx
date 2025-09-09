export const metadata = { title: 'swer4ock analytics' };

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
