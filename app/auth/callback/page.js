"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const handleCallback = async () => {
      // Supabase parses #access_token on page load - poll for session
      for (let i = 0; i < 20; i++) {
        if (!mounted) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (typeof window !== "undefined") {
            window.history.replaceState(null, "", "/");
          }
          router.replace("/");
          return;
        }
        await new Promise((r) => setTimeout(r, 100));
      }
      setError("Sign-in timed out. Please try again.");
    };

    handleCallback();
    return () => { mounted = false; };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-red-500 p-4">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <p className="text-white p-4">Signing you in...</p>
    </div>
  );
}
