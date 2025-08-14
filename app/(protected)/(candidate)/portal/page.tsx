import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PortalPageProps {
  searchParams: {
    candidate_id?: string
    verified?: string
  }
}

export default async function PortalPage({ searchParams }: PortalPageProps) {
  const supabase = await createClient()
  
  // For authenticated candidates, use their user info
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // For magic link access, get candidate info
  let candidateInfo = null
  if (searchParams.candidate_id && searchParams.verified === 'true') {
    const { data: candidate } = await supabase
      .from('candidates')
      .select(`
        id,
        first_name,
        last_name,
        phone,
        candidate_agencies (
          agency_id,
          agencies (
            name
          )
        )
      `)
      .eq('id', searchParams.candidate_id)
      .single()
    
    candidateInfo = candidate
  }

  const displayName = candidateInfo 
    ? `${candidateInfo.first_name} ${candidateInfo.last_name}`
    : user?.email || 'Candidate'

  const agencyName = candidateInfo?.candidate_agencies?.[0]?.agencies?.name

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {displayName}
        </h1>
        <p className="text-gray-600">
          Your personalized SEN preparation journey
          {agencyName && <span className="ml-2 text-teal-600">via {agencyName}</span>}
        </p>
        {candidateInfo && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">
              ✓ Successfully verified via magic link
            </p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-teal-600">Preparation Progress</CardTitle>
            <CardDescription>Your learning journey status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">0%</div>
            <p className="text-sm text-gray-500">Ready to start your journey</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-teal-600">Next Module</CardTitle>
            <CardDescription>Upcoming learning content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-gray-900">Welcome Module</div>
            <p className="text-sm text-gray-500">Introduction to SEN support</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Learning Path</CardTitle>
          <CardDescription>
            Personalized micro-learning modules delivered via WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-2">🎯 Module 1: Introduction to SEN</h3>
              <p className="text-gray-600 text-sm mb-3">
                Understanding Special Educational Needs and your role as a Teaching Assistant
              </p>
              <Button size="sm" disabled className="bg-gray-400">
                Coming Soon
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-2">🧠 Module 2: Learning Differences</h3>
              <p className="text-gray-600 text-sm mb-3">
                Recognizing and supporting different learning styles and needs
              </p>
              <Button size="sm" disabled className="bg-gray-400">
                Locked
              </Button>
            </div>

            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-2">💬 Module 3: Communication Strategies</h3>
              <p className="text-gray-600 text-sm mb-3">
                Effective communication techniques with SEN students
              </p>
              <Button size="sm" disabled className="bg-gray-400">
                Locked
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
