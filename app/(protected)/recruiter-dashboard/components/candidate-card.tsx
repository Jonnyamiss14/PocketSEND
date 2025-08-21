'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  PhoneIcon, 
  MailIcon, 
  MapPinIcon, 
  FlameIcon,
  ClockIcon,
  BriefcaseIcon,
  MoreVerticalIcon
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Candidate {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  learning_streak: number
  total_learning_minutes: number
  confidence_score: number
  last_active_at: string
  is_active: boolean
  candidate_agencies: Array<{
    agency_id: string
    status: string
    assigned_consultant_id: string
  }>
  placements: Array<{ count: number }>
  preparation_modules: Array<{ count: number }>
}

interface CandidateCardProps {
  candidate: Candidate
  agencyId: string
}

export function CandidateCard({ candidate, agencyId }: CandidateCardProps) {
  const getActivityStatus = () => {
    const lastActive = new Date(candidate.last_active_at)
    const now = new Date()
    const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60)
    
    if (diffHours <= 24) {
      return { color: 'bg-green-500', label: 'Active today' }
    } else if (diffHours <= 168) { // 7 days
      return { color: 'bg-yellow-500', label: 'Active this week' }
    } else {
      return { color: 'bg-gray-400', label: 'Inactive' }
    }
  }

  const activityStatus = getActivityStatus()
  const placementCount = candidate.placements?.[0]?.count || 0
  const moduleCount = candidate.preparation_modules?.[0]?.count || 0
  
  const formatLastActive = () => {
    try {
      return formatDistanceToNow(new Date(candidate.last_active_at), { addSuffix: true })
    } catch {
      return 'Unknown'
    }
  }

  const getStreakDisplay = () => {
    if (candidate.learning_streak > 0) {
      return (
        <div className="flex items-center space-x-1 text-orange-600">
          <FlameIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{candidate.learning_streak} day streak</span>
        </div>
      )
    }
    return (
      <div className="flex items-center space-x-1 text-gray-400">
        <FlameIcon className="w-4 h-4" />
        <span className="text-sm">No streak</span>
      </div>
    )
  }

  const formatLearningTime = () => {
    const hours = Math.floor(candidate.total_learning_minutes / 60)
    const minutes = candidate.total_learning_minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Activity Status Indicator */}
            <div className="relative">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-teal-700">
                  {candidate.first_name[0]}{candidate.last_name[0]}
                </span>
              </div>
              <div 
                className={`absolute -bottom-1 -right-1 w-4 h-4 ${activityStatus.color} rounded-full border-2 border-white`}
                title={activityStatus.label}
              />
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {candidate.first_name} {candidate.last_name}
              </h3>
              <p className="text-sm text-gray-500 truncate">{candidate.email}</p>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVerticalIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <PhoneIcon className="w-4 h-4" />
            <span className="truncate">{candidate.phone}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4" />
            <span className="truncate">{candidate.address || 'Location not set'}</span>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Confidence Score</span>
            <span className="text-sm text-gray-600">{candidate.confidence_score}%</span>
          </div>
          <Progress value={candidate.confidence_score} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{placementCount}</div>
            <div className="text-xs text-gray-500">Placements</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{moduleCount}</div>
            <div className="text-xs text-gray-500">Modules</div>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          {getStreakDisplay()}
          
          <div className="flex items-center space-x-1 text-gray-600">
            <ClockIcon className="w-4 h-4" />
            <span className="text-sm">{formatLearningTime()} total learning</span>
          </div>
        </div>

        {/* Last Active */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Last active: {formatLastActive()}</span>
          <Badge 
            variant={activityStatus.color === 'bg-green-500' ? 'success' : 
                    activityStatus.color === 'bg-yellow-500' ? 'warning' : 'outline'}
            className="text-xs"
          >
            {activityStatus.label}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-3">
          <Button size="sm" variant="outline" className="flex-1">
            <MailIcon className="w-4 h-4 mr-1" />
            Message
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <BriefcaseIcon className="w-4 h-4 mr-1" />
            Place
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}