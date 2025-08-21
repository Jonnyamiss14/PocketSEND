'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import { exportCandidates } from '../actions'
import { toast } from 'react-hot-toast'

interface ExportButtonProps {
  searchParams: {
    search?: string
    location?: string
    status?: string
  }
}

export function ExportButton({ searchParams }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const result = await exportCandidates(searchParams)
      
      if (result.success && result.csv) {
        // Create and download the CSV file
        const blob = new Blob([result.csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = result.filename || 'candidates.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        toast.success('Candidates exported successfully!')
      } else {
        toast.error(result.error || 'Failed to export candidates')
      }
    } catch (error) {
      console.error('Error exporting candidates:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
          Exporting...
        </>
      ) : (
        <>
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export CSV
        </>
      )}
    </Button>
  )
}