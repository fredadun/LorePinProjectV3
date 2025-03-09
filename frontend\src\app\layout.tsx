import { type ReactNode } from 'react'
import { type Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Suspense } from 'react'

// Providers
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ThemeProvider } from '@mui/material/styles'
import { MotionConfig } from 'framer-motion'
import { theme } from '@/theme/theme';

// Components
import Navigation from '@/components/common/Navigation'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Loading } from '@/components/common/Loading'

// Styles
import '@/styles/globals.css'

// Font configurations
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

// Types
interface RootLayoutProps {
  children: ReactNode
}

// Metadata configuration
export const metadata: Metadata = {
  title: 'LorePin - Discover Challenges, Earn Rewards',
  description: 'Explore your city, complete challenges, and earn LoreCoins that can be redeemed for exclusive rewards.',
  keywords: ['challenges', 'rewards', 'city exploration', 'gaming'],
  authors: [{ name: 'LorePin Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: RootLayoutProps) {
  const fontClasses = `${inter.variable} ${spaceGrotesk.variable}`

  return (
    <html lang="en" className={fontClasses}>
      <body className="min-h-screen bg-gray-50 antialiased">
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <MotionConfig reducedMotion="user">
                <Navigation />
                <Suspense fallback={<Loading />}>
                  <main className="flex-grow">
                    {children}
                  </main>
                </Suspense>
              </MotionConfig>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 
