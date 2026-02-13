"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Bookmarks from "./bookmarks";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes (THIS FIXES THE LOOP)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  if (!user) {
    return (
      
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        {/* Title BELOW button */}
  <h1 className="text-4xl font-bold text-white">
    Smart Bookmarks App
  </h1>
  {/* Button */}
  <button
    onClick={() =>
      supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
          queryParams: {
            prompt: "select_account",
          },
        },
      })
    }
    className="px-6 py-3 bg-white text-black rounded"
  >
    Sign in with Google
  </button>

  
</div>

    );
  }

  return <Bookmarks user={user} />;
}
