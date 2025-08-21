'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CandidateCard } from './candidate-card'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

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

interface CandidatesGridProps {
  initialCandidates: Candidate[]
  agencyId: string
  userId: string
  searchParams: {
    search?: string
    location?: string
    status?: string
    page?: string
  }
}

export function CandidatesGrid({ 
  initialCandidates, 
  agencyId, 
  userId, 
  searchParams 
}: CandidatesGridProps) {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const currentPage = parseInt(searchParams.page || '1')
  const hasNextPage = candidates.length === 20 // If we got 20 results, there might be more
  const hasPrevPage = currentPage > 1

  const refreshCandidates = async () => {
    setIsLoading(true)
    try {
      let query = supabase
        .from('candidates')
        .select(`
          *,
          candidate_agencies!inner(
            agency_id,
            status,
            assigned_consultant_id
          ),
          placements(count),
          preparation_modules(count)
        `)
        .eq('candidate_agencies.agency_id', agencyId)
        .order('last_active_at', { ascending: false })

      // Apply the same filters as the server component
      if (searchParams.search) {
        query = query.or(
          `first_name.ilike.%${searchParams.search}%,last_name.ilike.%${searchParams.search}%,email.ilike.%${searchParams.search}%`
        )
      }

      if (searchParams.location) {
        query = query.ilike('address', `%${searchParams.location}%`)
      }

      if (searchParams.status === 'active') {
        query = query.gte('last_active_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      } else if (searchParams.status === 'inactive') {
        query = query.lt('last_active_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      }

      const page = parseInt(searchParams.page || '1')
      const limit = 20
      const offset = (page - 1) * limit
      query = query.range(offset, offset + limit - 1)

      const { data, error } = await query

      if (error) {
        console.error('Error refreshing candidates:', error)
      } else {
        setCandidates(data || [])
      }
    } catch (error) {
      console.error('Error refreshing candidates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const channel = supabase
      .channel('candidates-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'candidates',
        filter: `id=in.(select candidate_id from candidate_agencies where agency_id=eq.${agencyId})`
      }, () => {
        refreshCandidates()
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'preparation_modules'
      }, () => {
        refreshCandidates()
      })
      .subscribe()

    return () => { 
      supabase.removeChannel(channel) 
    }
  }, [agencyId, searchParams, supabase])

  const goToPage = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== 'page') {
        params.set(key, value)
      }
    })
    params.set('page', page.toString())
    router.push(`/recruiter-dashboard?${params.toString()}`)
  }

  if (candidates.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No candidates found
          </h3>
          <p className="text-gray-500 mb-6">
            {searchParams.search || searchParams.location || searchParams.status
              ? "Try adjusting your filters to see more results."
              : "Get started by adding your first candidate to the system."
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {isLoading ? (
            "Loading candidates..."
          ) : (
            `Showing ${candidates.length} candidate${candidates.length !== 1 ? 's' : ''} 
             ${currentPage > 1 ? `(Page ${currentPage})` : ''}`
          )}
        </p>
      </div>

      {/* Candidates Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isLoading ? 'opacity-50' : ''}`}>
        {candidates.map((candidate) => (
          <CandidateCard 
            key={candidate.id} 
            candidate={candidate}
            agencyId={agencyId}
          />
        ))}
      </div>

      {/* Pagination */}
      {(hasNextPage || hasPrevPage) && (
        <div className="flex justify-center items-center space-x-2 pt-6">
          <Button
            variant="outline"
            onClick={() => goToPage(currentPage - 1)}
            disabled={!hasPrevPage || isLoading}
            className="flex items-center"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {currentPage}
          </span>
          
          <Button
            variant="outline"
            onClick={() => goToPage(currentPage + 1)}
            disabled={!hasNextPage || isLoading}
            className="flex items-center"
          >
            Next
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Updating candidates...</span>
          </div>
        </div>
      )}
    </div>
  )
}