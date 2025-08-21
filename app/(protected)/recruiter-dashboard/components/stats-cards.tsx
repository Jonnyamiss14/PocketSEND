'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UsersIcon, ActivityIcon, CalendarIcon, TrendingUpIcon } from 'lucide-react'

interface Stats {
  total_candidates: number
  active_learners: number
  placements_this_week: number
  average_confidence: number
}

interface StatsCardsProps {
  initialStats: Stats
  agencyId: string
  userId: string
}

export function StatsCards({ initialStats, agencyId, userId }: StatsCardsProps) {
  const [stats, setStats] = useState<Stats>(initialStats)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const refreshStats = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.rpc('get_recruiter_stats', {
        agency_uuid: agencyId
      }).maybeSingle()
      
      if (data) {
        setStats(data as Stats)
      } else if (error) {
        console.warn('Stats refresh failed, keeping current stats:', error.message)
      }
    } catch (error) {
      console.error('Error refreshing stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const channel = supabase
      .channel('dashboard-stats')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'candidates',
        filter: `id=in.(select candidate_id from candidate_agencies where agency_id=eq.${agencyId})`
      }, () => {
        refreshStats()
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'placements',
        filter: `agency_id=eq.${agencyId}`
      }, () => {
        refreshStats()
      })
      .subscribe()

    return () => { 
      supabase.removeChannel(channel) 
    }
  }, [agencyId, supabase])

  const cards = [
    {
      title: 'Total Candidates',
      description: 'Active candidates in your pool',
      value: stats.total_candidates,
      icon: UsersIcon,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      title: 'Active Learners',
      description: 'Active in last 7 days',
      value: stats.active_learners,
      icon: ActivityIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Placements This Week',
      description: 'New placements created',
      value: stats.placements_this_week,
      icon: CalendarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Average Confidence',
      description: 'Mean confidence score',
      value: `${Math.round(stats.average_confidence)}%`,
      icon: TrendingUpIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className={`relative ${isLoading ? 'opacity-70' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color} mb-1`}>
              {card.value}
            </div>
            <CardDescription className="text-xs">
              {card.description}
            </CardDescription>
          </CardContent>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
              <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}