'use client'

import { useState } from 'react'

interface AccountSetupRequiredProps {
  authUser: {
    id: string
    email: string | undefined
  }
}

export default function AccountSetupRequired({ authUser }: AccountSetupRequiredProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('auth_id', authUser.id)
    formData.append('email', authUser.email || '')
    
    try {
      const response = await fetch('/api/setup-user', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success && data.redirect) {
        window.location.href = data.redirect
      } else if (data.error) {
        setError(data.error)
      }
    } catch (error) {
      console.error('Setup error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Complete Your Profile</h1>
        <p className="text-gray-600 mb-6">
          Welcome! We need to set up your account to continue.
        </p>
        
        <div className="bg-gray-50 p-4 rounded mb-6">
          <p className="text-sm"><strong>Email:</strong> {authUser.email || 'Not provided'}</p>
          <p className="text-sm"><strong>User ID:</strong> {authUser.id}</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSetup} className="space-y-4">
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Setting up...' : 'Complete Setup & Continue'}
          </button>
        </form>
        
        <div className="mt-4 pt-4 border-t">
          <a 
            href="/login" 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to login
          </a>
        </div>
      </div>
    </div>
  )
}