'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

export default function CandidateLoginPage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Failed to send magic link')
        return
      }

      setSent(true)
      toast.success('Magic link sent! Check your WhatsApp')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-teal-600">Check Your WhatsApp</CardTitle>
            <CardDescription>
              We've sent a magic link to {phone}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Click the link in your WhatsApp message to access your preparation materials.
            </p>
            <Button
              onClick={() => setSent(false)}
              variant="outline"
              className="border-teal-600 text-teal-600 hover:bg-teal-50"
            >
              Send Another Link
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-teal-600">Candidate Access</CardTitle>
          <CardDescription>
            Enter your phone number to receive a secure access link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7700 900000"
                required
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">
                We'll send you a secure link via WhatsApp
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-teal-600 hover:underline">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
