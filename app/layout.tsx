import { Toaster } from 'react-hot-toast'
import './globals.css'
import '../styles/design-system.css'
import { SupabaseProvider } from '@/components/providers/supabase-provider'
import { QueryProvider } from '@/components/providers/query-provider'

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
      <body style={{ fontFamily: "'Noto Sans', sans-serif" }}>
        <SupabaseProvider>
          <QueryProvider>
            <main className="min-h-screen">
              {children}
            </main>
            <Toaster position="top-right" />
          </QueryProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
