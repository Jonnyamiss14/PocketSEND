import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Agency Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {user?.email}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-teal-600">Active Candidates</CardTitle>
            <CardDescription>Candidates currently in preparation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <p className="text-sm text-gray-500">No candidates yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-teal-600">WhatsApp Credits</CardTitle>
            <CardDescription>Remaining message credits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">--</div>
            <p className="text-sm text-gray-500">Credits will be shown here</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-teal-600">Subscription</CardTitle>
            <CardDescription>Current plan status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">TRIAL</div>
            <p className="text-sm text-gray-500">Setup your subscription</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Start managing your candidates and preparing them for SEN placements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Add New Candidate</h3>
              <p className="text-gray-600 text-sm mb-3">
                Register a new Teaching Assistant for preparation
              </p>
              <Button className="bg-teal-600 hover:bg-teal-700" disabled>
                Add Candidate (Coming Soon)
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Manage Training Content</h3>
              <p className="text-gray-600 text-sm mb-3">
                Customize AI-powered micro-learning modules
              </p>
              <Button variant="outline" disabled>
                Manage Content (Coming Soon)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
