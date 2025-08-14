import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    auth: false,
    database: false,
    admin: false,
    tables: {
      agencies: false,
      users: false,
      auth_user_mapping: false
    }
  }

  try {
    // Check auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    checks.auth = !!user

    // Check database access
    const { error: dbError } = await supabase.from('agencies').select('id').limit(1)
    checks.database = !dbError

    // Check admin client
    try {
      const admin = createAdminClient()
      checks.admin = !!admin
    } catch {
      checks.admin = false
    }

    // Check tables exist
    const tables = ['agencies', 'users', 'auth_user_mapping']
    for (const table of tables) {
      const { error } = await supabase.from(table).select('count').limit(1)
      checks.tables[table as keyof typeof checks.tables] = !error
    }

    return NextResponse.json({
      healthy: checks.auth && checks.database && checks.admin,
      checks
    })
  } catch (error) {
    return NextResponse.json({
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      checks
    })
  }
}