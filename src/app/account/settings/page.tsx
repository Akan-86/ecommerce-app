"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AccountSettingsPage() {
  const { user, loading, updateUserProfile } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
    if (user?.photoURL) {
      setAvatarUrl(user.photoURL);
    }
  }, [loading, user, router]);

  const handleAvatarChange = async (file: File) => {
    if (!user || !file) return;
    try {
      setUploading(true);
      const avatarRef = ref(storage, `avatars/${user.uid}.jpg`);
      await uploadBytes(avatarRef, file);
      const url = await getDownloadURL(avatarRef);
      await updateUserProfile({ photoURL: url });
      setAvatarUrl(url);
    } finally {
      setUploading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          <span aria-live="polite">Loading settings…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold">Account Settings</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Avatar */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Avatar</h2>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white text-2xl font-black">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                user.email?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAvatarChange(file);
                  }}
                />
                {uploading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                    Uploading…
                  </span>
                ) : (
                  <span>Upload avatar</span>
                )}
              </label>
              <p className="mt-2 text-xs text-gray-500">
                PNG/JPG up to a few MB.
              </p>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="md:col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Profile</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                setSaving(true);
                await updateUserProfile({ displayName });
              } finally {
                setSaving(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full rounded border px-3 py-2 bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Display name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2 text-white text-sm font-medium hover:bg-gray-900 disabled:opacity-50"
            >
              {saving && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              <span>{saving ? "Saving…" : "Save changes"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
