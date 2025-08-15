'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, BookOpen, MessageSquare } from 'lucide-react'

export default function CandidateDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your PocketSEND Portal
          </h1>
          <p className="text-gray-600">
            Your personalized SEN training journey starts here
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <BookOpen className="h-8 w-8 text-teal-600 mx-auto" />
              <CardTitle className="text-lg">Training Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-600 mb-1">12</div>
              <CardDescription>Available to start</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
              <CardTitle className="text-lg">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-1">3</div>
              <CardDescription>Modules finished</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <Clock className="h-8 w-8 text-orange-600 mx-auto" />
              <CardTitle className="text-lg">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 mb-1">2</div>
              <CardDescription>Active modules</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <MessageSquare className="h-8 w-8 text-blue-600 mx-auto" />
              <CardTitle className="text-lg">WhatsApp Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-1">✓</div>
              <CardDescription>Connected & active</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Learning Path */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-teal-600">Your Learning Path</CardTitle>
                <CardDescription>
                  Personalized training modules based on your experience level
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Module 1 */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Introduction to SEN</h4>
                      <p className="text-sm text-gray-600">Understanding special educational needs basics</p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Completed</span>
                </div>

                {/* Module 2 */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-orange-50 border-orange-200">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <h4 className="font-medium">Behavior Management</h4>
                      <p className="text-sm text-gray-600">Effective strategies for challenging behaviors</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                    Continue
                  </Button>
                </div>

                {/* Module 3 */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                    <div>
                      <h4 className="font-medium">Communication Techniques</h4>
                      <p className="text-sm text-gray-600">Building rapport with SEN students</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Locked</span>
                </div>

                {/* Module 4 */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                    <div>
                      <h4 className="font-medium">Classroom Support Strategies</h4>
                      <p className="text-sm text-gray-600">Practical support techniques for teachers</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Locked</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Completed "Introduction to SEN" module</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span>Received practice scenario via WhatsApp</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span>Started "Behavior Management" module</span>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">WhatsApp Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Status</span>
                  <span className="text-sm text-green-600 font-medium">Connected</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Next lesson</span>
                  <span className="text-sm">Tomorrow 9:00 AM</span>
                </div>
                <Button className="w-full" variant="outline">
                  Manage Settings
                </Button>
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Course Completion</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-teal-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 pt-2">
                    Great start! Continue with your current module to unlock the next one.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}