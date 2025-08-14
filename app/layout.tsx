import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { SupabaseProvider } from '@/components/providers/supabase-provider'
import { QueryProvider } from '@/components/providers/query-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PocketSEND - SEN Staff Preparation',
  description: 'Prepare teaching assistants for success',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <QueryProvider>
            <main className="min-h-screen bg-gradient-to-br from-teal-50 to-white">
              {children}
            </main>
            <Toaster position="top-right" />
          </QueryProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
