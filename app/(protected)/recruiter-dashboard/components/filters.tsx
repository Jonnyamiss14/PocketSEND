'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { SearchIcon, XIcon } from 'lucide-react'

export function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  const updateSearchParams = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    // Reset to page 1 when filters change
    params.delete('page')
    
    router.push(`/recruiter-dashboard?${params.toString()}`)
  }, [searchParams, router])

  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateSearchParams('search', value || null)
  }, 500)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    router.push('/recruiter-dashboard')
  }

  const hasActiveFilters = searchParams.get('search') || 
                          searchParams.get('location') || 
                          searchParams.get('status')

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Candidates
          </label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="search"
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Location Filter */}
        <div className="w-full lg:w-48">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <Select
            value={searchParams.get('location') || 'all'}
            onValueChange={(value) => updateSearchParams('location', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              <SelectItem value="London">London</SelectItem>
              <SelectItem value="Manchester">Manchester</SelectItem>
              <SelectItem value="Birmingham">Birmingham</SelectItem>
              <SelectItem value="Leeds">Leeds</SelectItem>
              <SelectItem value="Liverpool">Liverpool</SelectItem>
              <SelectItem value="Bristol">Bristol</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Activity Status
          </label>
          <Select
            value={searchParams.get('status') || 'all'}
            onValueChange={(value) => updateSearchParams('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All candidates</SelectItem>
              <SelectItem value="active">Active (last 7 days)</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="whitespace-nowrap"
          >
            <XIcon className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchParams.get('search') && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-800">
                Search: {searchParams.get('search')}
              </span>
            )}
            {searchParams.get('location') && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Location: {searchParams.get('location')}
              </span>
            )}
            {searchParams.get('status') && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Status: {searchParams.get('status')}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}