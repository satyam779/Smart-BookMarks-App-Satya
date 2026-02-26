"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Bookmarks({ user }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBookmarks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookmarks:", error);
    } else {
      setBookmarks(data || []);
    }
  };

  const formatUrl = (input) => {
    let formattedUrl = input.trim().toLowerCase();
    
    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      const domainPattern = /^[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}/;
      if (!domainPattern.test(formattedUrl)) {
        formattedUrl = formattedUrl + ".com";
      }
      formattedUrl = "https://" + formattedUrl;
    }
    
    return formattedUrl;
  };

  const addBookmark = async () => {
    if (!title.trim() || !url.trim()) return;

    const formattedUrl = formatUrl(url);

    await supabase.from("bookmarks").insert({
      title: title.trim(),
      url: formattedUrl,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");
    fetchBookmarks();
  };

  const deleteBookmark = async (id) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Bookmarks</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-600">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 flex-1"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={addBookmark}
          className="bg-blue-500 text-white px-4"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {bookmarks.map((b) => (
          <li
            key={b.id}
            className="flex justify-between items-center border p-2"
          >
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {b.title}
            </a>

            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
