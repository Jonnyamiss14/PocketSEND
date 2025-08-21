'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'

const candidateSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Please enter a complete address including postcode'),
})

type CandidateFormData = z.infer<typeof candidateSchema>

interface AddCandidateModalProps {
  children: React.ReactNode
}

export function AddCandidateModal({ children }: AddCandidateModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
  })

  const onSubmit = async (data: CandidateFormData) => {
    setIsSubmitting(true)
    const supabase = createClient()
    
    try {
      // 1. Get the current user and their agency information
      console.log('🔍 [ADD CANDIDATE] Getting current user...')
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('❌ [ADD CANDIDATE] Auth error:', authError)
        toast.error('Authentication error. Please try logging in again.')
        return
      }
      
      console.log('🔍 [ADD CANDIDATE] Current user ID:', user.id)
      
      // 2. Get user's agency information from users table
      console.log('🔍 [ADD CANDIDATE] Fetching user agency data...')
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, agency_id, role')
        .eq('auth_user_id', user.id)
        .single()
      
      if (userError || !userData) {
        console.error('❌ [ADD CANDIDATE] User data error:', userError)
        toast.error('User not found or not authorized')
        return
      }
      
      console.log('🔍 [ADD CANDIDATE] User agency data:', userData)
      
      // 3. Structure the candidate data correctly with all required fields
      const candidateData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
        recruiter_id: userData.id,                // FIXED: Use users table ID, not auth ID
        status: 'active',                         // REQUIRED - status field
        is_active: true,                          // REQUIRED - active status
        availability: 'full_time' as const,      // Default availability
        experience_years: 0,                      // Default experience
        dbs_status: 'pending' as const,           // Default DBS status
        learning_streak: 0,                       // Default learning streak
        total_learning_minutes: 0,                // Default learning time
        confidence_score: 0,                      // Default confidence score
        last_active_at: new Date().toISOString(), // Current timestamp
        created_at: new Date().toISOString(),     // Current timestamp
        updated_at: new Date().toISOString()      // Current timestamp
      }
      
      console.log('🔍 [ADD CANDIDATE] Submitting data:', candidateData)
      
      // 4. Insert candidate into Supabase
      const { data: insertedCandidate, error: insertError } = await supabase
        .from('candidates')
        .insert([candidateData])
        .select()
        .single()
      
      // 5. Handle candidate insertion result with detailed error logging
      if (insertError) {
        console.error('❌ [ADD CANDIDATE] Candidate insert error:', insertError)
        console.error('❌ [ADD CANDIDATE] Error code:', insertError.code)
        console.error('❌ [ADD CANDIDATE] Error message:', insertError.message)
        console.error('❌ [ADD CANDIDATE] Error details:', insertError.details)
        console.error('❌ [ADD CANDIDATE] Error hint:', insertError.hint)
        
        let errorMessage = 'Failed to create candidate'
        
        if (insertError.code === '23505') {
          errorMessage = 'This candidate may already exist in the system.'
        } else if (insertError.code === '23503') {
          errorMessage = 'Database constraint error. Please contact support.'
        } else if (insertError.code === '42P01') {
          errorMessage = 'Database table not found. Please contact support.'
        } else if (insertError.code === '42703') {
          errorMessage = 'Database column not found. Please contact support.'
        } else if (insertError.message?.includes('RLS')) {
          errorMessage = 'Permission denied. Please contact support.'
        }
        
        toast.error(errorMessage)
        return
      }
      
      console.log('✅ [ADD CANDIDATE] Successfully created candidate:', insertedCandidate)
      
      // 6. Create candidate_agencies junction table relationship (CRITICAL for dashboard visibility)
      const candidateAgencyData = {
        candidate_id: insertedCandidate.id,
        agency_id: userData.agency_id,
        status: 'active',
        assigned_consultant_id: userData.id,
        registration_date: new Date().toISOString(),
        assigned_at: new Date().toISOString()
      }
      
      console.log('🔍 [ADD CANDIDATE] Creating agency relationship:', candidateAgencyData)
      
      const { error: linkError } = await supabase
        .from('candidate_agencies')
        .insert([candidateAgencyData])
      
      if (linkError) {
        console.error('❌ [ADD CANDIDATE] Junction table error:', linkError)
        // Candidate exists but won't show in dashboard - show warning
        toast.error('Candidate created but may not appear in dashboard. Please refresh and contact support if issue persists.')
        return
      }
      
      console.log('✅ [ADD CANDIDATE] Successfully linked candidate to agency')
      
      // Success! Candidate is now linked and will appear in dashboard
      toast.success('Candidate added successfully!')
      reset()
      setOpen(false)
      router.refresh()
      
    } catch (error) {
      // Enhanced catch block for unexpected errors
      console.error('❌ [ADD CANDIDATE] Unexpected error:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
        errorName: error instanceof Error ? error.name : 'Unknown',
        timestamp: new Date().toISOString(),
        formData: data
      })
      
      let errorMessage = 'An unexpected error occurred'
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network connection error. Please check your internet connection.'
      } else if (error instanceof SyntaxError) {
        errorMessage = 'Data format error. Please try again.'
      } else if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.'
        } else if (error.message.includes('abort')) {
          errorMessage = 'Request was cancelled. Please try again.'
        } else if (error.message.includes('cors')) {
          errorMessage = 'Cross-origin request blocked. Please contact support.'
        }
      }
      
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: '#ffffff',
          color: '#111827'
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#111827' }}>Add New Candidate</DialogTitle>
          <DialogDescription style={{ color: '#6b7280' }}>
            Register a new teaching assistant in your candidate pool.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name" style={{ color: '#374151', fontWeight: 500 }}>
                First Name *
              </Label>
              <Input
                id="first_name"
                {...register('first_name')}
                placeholder="e.g., Sarah"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: errors.first_name ? '#dc2626' : '#d1d5db',
                  color: '#111827',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              />
              {errors.first_name && (
                <p className="text-sm mt-1" style={{ color: '#dc2626' }}>
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="last_name" style={{ color: '#374151', fontWeight: 500 }}>
                Last Name *
              </Label>
              <Input
                id="last_name"
                {...register('last_name')}
                placeholder="e.g., Johnson"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: errors.last_name ? '#dc2626' : '#d1d5db',
                  color: '#111827',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              />
              {errors.last_name && (
                <p className="text-sm mt-1" style={{ color: '#dc2626' }}>
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <Label htmlFor="email" style={{ color: '#374151', fontWeight: 500 }}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="e.g., sarah@example.com"
              style={{
                backgroundColor: '#ffffff',
                borderColor: errors.email ? '#dc2626' : '#d1d5db',
                color: '#111827',
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            />
            {errors.email && (
              <p className="text-sm mt-1" style={{ color: '#dc2626' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" style={{ color: '#374151', fontWeight: 500 }}>
              Phone Number *
            </Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="e.g., +44 7XXX XXXXXX"
              style={{
                backgroundColor: '#ffffff',
                borderColor: errors.phone ? '#dc2626' : '#d1d5db',
                color: '#111827',
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            />
            {errors.phone && (
              <p className="text-sm mt-1" style={{ color: '#dc2626' }}>
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address" style={{ color: '#374151', fontWeight: 500 }}>
              Address (including postcode) *
            </Label>
            <Input
              id="address"
              {...register('address')}
              placeholder="Full address including postcode"
              style={{
                backgroundColor: '#ffffff',
                borderColor: errors.address ? '#dc2626' : '#d1d5db',
                color: '#111827',
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            />
            {errors.address && (
              <p className="text-sm mt-1" style={{ color: '#dc2626' }}>
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                'Add Candidate'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}