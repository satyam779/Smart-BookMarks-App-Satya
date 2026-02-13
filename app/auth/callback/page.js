"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      router.replace("/");
    });
  }, [router]);

  return <p className="p-4">Signing you in...</p>;
}
