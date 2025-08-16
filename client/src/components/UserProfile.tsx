import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export function UserProfile({ onSignOut }: { onSignOut: () => void; }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      if (user && !currentUser) {
        // User signed out
        if (onSignOut) onSignOut();
      }
      setUser(currentUser)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [user, onSignOut])

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // The onAuthStateChange listener will handle the rest
  }

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse"></div>
  }

  if (user) {
    return (
      <div className="relative group">
        <img
          src={user.user_metadata?.avatar_url}
          alt={user.user_metadata?.full_name}
          width={40}
          height={40}
          className="rounded-full cursor-pointer"
        />
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
    >
      Sign In
    </button>
  )
}
