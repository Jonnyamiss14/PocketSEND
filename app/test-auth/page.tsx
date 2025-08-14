'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Alert, AlertDescription } from '@/components/ui/alert'
import toast from 'react-hot-toast'

export default function TestAuthPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const addResult = (test: string, success: boolean, details: any) => {
    setResults(prev => [...prev, { test, success, details, timestamp: new Date().toISOString() }])
  }

  const testDatabaseConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-db')
      const result = await response.json()
      
      addResult('Database Connection', result.success, result)
      
      if (result.success) {
        toast.success('✅ Supabase connection working')
      } else {
        toast.error(`❌ Database issue: ${result.details}`)
      }
    } catch (error) {
      addResult('Database Connection', false, { error: error instanceof Error ? error.message : 'Unknown error' })
      toast.error('❌ Connection test failed')
    }
    setLoading(false)
  }

  const testAgencySignup = async () => {
    setLoading(true)
    const testData = {
      email: `test-${Date.now()}@agency.com`,
      password: 'TestPass123!',
      agencyName: 'Test Agency Ltd'
    }
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      
      const result = await response.json()
      addResult('Agency Signup', result.success, { ...result, testData })
      
      if (result.success) {
        toast.success('✅ Agency signup working')
      } else {
        toast.error(`❌ Signup failed: ${result.error}`)
      }
    } catch (error) {
      addResult('Agency Signup', false, { error: error instanceof Error ? error.message : 'Unknown error' })
      toast.error('❌ Signup test failed')
    }
    setLoading(false)
  }

  const testMagicLink = async () => {
    setLoading(true)
    const testPhone = '+447700900123'
    
    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: testPhone })
      })
      
      const result = await response.json()
      addResult('Magic Link', response.ok, { ...result, testPhone })
      
      if (response.ok) {
        toast.success('✅ Magic link generation working')
        
        // Show debug link if available
        if (result.debug_link) {
          toast((t) => (
            <div className="text-sm">
              <p className="font-medium mb-2">Magic Link Generated:</p>
              <button
                className="text-teal-600 underline"
                onClick={() => {
                  window.open(result.debug_link, '_blank')
                  toast.dismiss(t.id)
                }}
              >
                Click to test magic link →
              </button>
            </div>
          ), { duration: 8000 })
        }
      } else {
        toast.error(`❌ Magic link failed: ${result.message}`)
      }
    } catch (error) {
      addResult('Magic Link', false, { error: error instanceof Error ? error.message : 'Unknown error' })
      toast.error('❌ Magic link test failed')
    }
    setLoading(false)
  }

  const runAllTests = async () => {
    setResults([])
    await testDatabaseConnection()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await testAgencySignup()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await testMagicLink()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-teal-600 mb-2">
            PocketSEND Authentication Test Suite
          </h1>
          <p className="text-gray-600">
            Test all authentication flows and database connections
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
              <CardDescription>Run individual tests or the complete suite</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={runAllTests} 
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                {loading ? 'Running tests...' : 'Run All Tests'}
              </Button>
              
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  variant="outline" 
                  onClick={testDatabaseConnection}
                  disabled={loading}
                  size="sm"
                >
                  Test Database Connection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={testAgencySignup}
                  disabled={loading}
                  size="sm"
                >
                  Test Agency Signup
                </Button>
                <Button 
                  variant="outline" 
                  onClick={testMagicLink}
                  disabled={loading}
                  size="sm"
                >
                  Test Magic Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Access authentication pages directly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a href="/login" target="_blank">
                <Button variant="outline" className="w-full">
                  Agency Login/Signup →
                </Button>
              </a>
              <a href="/candidate-login" target="_blank">
                <Button variant="outline" className="w-full">
                  Candidate Magic Link →
                </Button>
              </a>
              <a href="/dashboard" target="_blank">
                <Button variant="outline" className="w-full">
                  Agency Dashboard →
                </Button>
              </a>
              <a href="/portal" target="_blank">
                <Button variant="outline" className="w-full">
                  Candidate Portal →
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Latest test execution results</CardDescription>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tests run yet</p>
            ) : (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <Alert key={index} className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">
                            {result.success ? '✅' : '❌'} {result.test}
                          </span>
                          {result.details.error && (
                            <p className="text-sm text-red-600 mt-1">
                              {result.details.error}
                            </p>
                          )}
                          {result.details.message && (
                            <p className="text-sm text-gray-600 mt-1">
                              {result.details.message}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Alert className="mt-6">
          <AlertDescription>
            <strong>Database Issue Detected:</strong> The RLS (Row Level Security) policies in your Supabase database have an infinite recursion error. 
            The Supabase authentication system works correctly, but table queries fail. 
            To fix this, you'll need to adjust the RLS policies in your Supabase SQL Editor.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}