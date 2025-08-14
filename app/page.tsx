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
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3">
              Agency Login
            </Button>
          </Link>
          <Link href="/candidate-login">
            <Button size="lg" variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3">
              Candidate Access
            </Button>
          </Link>
        </div>
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
