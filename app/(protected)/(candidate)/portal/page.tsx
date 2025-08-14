import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function PortalPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Candidate Portal
        </h1>
        <p className="text-gray-600">
          Your personalized SEN preparation journey
        </p>
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
