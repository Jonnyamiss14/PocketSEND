'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import toast from 'react-hot-toast'

export default function CandidateSignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experienceLevel: 'new',
    agencyCode: '' // Optional agency invite code
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/candidate-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!result.success) {
        toast.error(result.error || 'Signup failed')
        return
      }

      toast.success('Account created! Check WhatsApp for your magic link.')
      router.push('/candidate-login')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-teal-50 to-white">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-teal-600">Join PocketSEND as a Candidate</CardTitle>
          <CardDescription>
            Start your journey to becoming an outstanding SEN professional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your.email@example.com"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">For important updates only</p>
            </div>

            <div>
              <Label htmlFor="phone">WhatsApp Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+44 7700 900000"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">We'll send your magic link here</p>
            </div>

            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select 
                value={formData.experienceLevel} 
                onValueChange={(value) => setFormData({...formData, experienceLevel: value})}
                disabled={loading}
              >
                <SelectTrigger id="experience">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New to SEN (0-1 years)</SelectItem>
                  <SelectItem value="some">Some Experience (1-3 years)</SelectItem>
                  <SelectItem value="experienced">Experienced (3+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="agencyCode">Agency Invite Code (Optional)</Label>
              <Input
                id="agencyCode"
                type="text"
                value={formData.agencyCode}
                onChange={(e) => setFormData({...formData, agencyCode: e.target.value})}
                placeholder="Enter if provided by your agency"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Candidate Account'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link href="/candidate-login" className="block text-sm text-teal-600 hover:underline">
              Already registered? Access with magic link
            </Link>
            <Link href="/login" className="block text-sm text-gray-600 hover:underline">
              Are you an agency? Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}