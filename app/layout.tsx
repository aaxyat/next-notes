import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { ThemeProvider } from 'next-themes'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}

