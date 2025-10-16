export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || 'Jimag Autos Marketplace',
  description: 'Browse and inquire — no payments online yet.'
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
