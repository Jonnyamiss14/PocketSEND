import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Pocket<span className="text-teal-600">SEND</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Prepare Teaching Assistants for Special Educational Needs placements through 
          AI-powered micro-learning via WhatsApp
        </p>
      </div>

      {/* Signup Options */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl text-teal-600">For Agencies</CardTitle>
            <CardDescription>
              Manage and prepare your candidates for SEN placements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-left text-sm text-gray-600 space-y-2">
              <li>✅ Manage multiple candidates</li>
              <li>✅ Track preparation progress</li>
              <li>✅ Automated WhatsApp delivery</li>
              <li>✅ School-specific training</li>
            </ul>
            <Link href="/login">
              <Button size="lg" className="w-full bg-teal-600 hover:bg-teal-700">
                Sign In as Agency
              </Button>
            </Link>
            <p className="text-xs text-gray-500">
              New agency? <Link href="/signup" className="text-teal-600 hover:underline">Create account</Link>
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl text-teal-600">For Candidates</CardTitle>
            <CardDescription>
              Get personalized SEN training delivered to your phone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-left text-sm text-gray-600 space-y-2">
              <li>📱 WhatsApp-based learning</li>
              <li>🎯 Personalized content</li>
              <li>🏆 Track achievements</li>
              <li>💬 AI practice scenarios</li>
            </ul>
            <Link href="/candidate-signup">
              <Button size="lg" className="w-full bg-teal-600 hover:bg-teal-700">
                Join as Candidate
              </Button>
            </Link>
            <p className="text-xs text-gray-500">
              Already registered? <Link href="/candidate-login" className="text-teal-600 hover:underline">Access with Magic Link</Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-teal-600">AI-Powered Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">
              Personalized preparation content delivered through intelligent micro-learning modules
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-teal-600">WhatsApp Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">
              Seamless delivery of training materials directly to candidates' phones
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-teal-600">Multi-Tenant Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">
              Complete B2B2C solution for recruitment agencies managing multiple candidates
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
