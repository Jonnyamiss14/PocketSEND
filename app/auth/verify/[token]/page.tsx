'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

type VerificationStatus = 'verifying' | 'success' | 'error' | 'expired'

export default function VerifyTokenPage() {
  const params = useParams()
  const router = useRouter()
  const [status, setStatus] = useState<VerificationStatus>('verifying')
  const [message, setMessage] = useState('')
  const token = params.token as string

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link')
      return
    }

    // Verify the magic link token
    verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      const result = await response.json()

      if (result.success) {
        setStatus('success')
        setMessage('Authentication successful! Redirecting to your dashboard...')
        
        // Redirect to candidate dashboard after short delay
        setTimeout(() => {
          router.push('/candidate-dashboard')
        }, 2000)
      } else {
        setStatus(result.expired ? 'expired' : 'error')
        setMessage(result.error || 'Verification failed')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An unexpected error occurred')
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        return <Loader2 className="h-16 w-16 text-teal-600 animate-spin" />
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-600" />
      case 'expired':
      case 'error':
        return <XCircle className="h-16 w-16 text-red-600" />
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case 'verifying':
        return 'Verifying your access...'
      case 'success':
        return 'Welcome to PocketSEND!'
      case 'expired':
        return 'Link Expired'
      case 'error':
        return 'Verification Failed'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-teal-50 to-white">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-2xl">{getStatusTitle()}</CardTitle>
          <CardDescription className="text-center">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'expired' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Your magic link has expired. Please request a new one.
              </p>
              <Link href="/candidate-login">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Request New Magic Link
                </Button>
              </Link>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Please try again or contact support if the problem persists.
              </p>
              <div className="flex flex-col space-y-2">
                <Link href="/candidate-login">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Try Again
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Return Home
                  </Button>
                </Link>
              </div>
            </div>
          )}
          
          {status === 'success' && (
            <p className="text-sm text-green-600">
              You'll be redirected automatically in a few seconds...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}