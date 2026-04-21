"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProfile, upsertProfile, type Profile } from "@/lib/queries";
import { User, AlertCircle, CheckCircle2, Square } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [profile,   setProfile]   = useState<Profile | null>(null);
  const [username,  setUsername]  = useState("");
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  // حماية: إذا مو مسجّل دخول ارسله لـ /sign-in
  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  // حمّل البروفايل من Supabase
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    async function load() {
      setLoading(true);
      const { data } = await getProfile(user!.id);
      if (data) {
        setProfile(data);
        setUsername(data.username ?? "");
      } else {
        // بروفايل جديد — استخدم اسم Clerk كقيمة افتراضية
        const defaultName =
          user!.firstName ??
          user!.emailAddresses[0]?.emailAddress?.split("@")[0] ??
          "";
        setUsername(defaultName);
      }
      setLoading(false);
    }

    load();
  }, [isLoaded, isSignedIn, user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    const { error: saveErr } = await upsertProfile(user.id, username.trim());

    if (saveErr) {
      setError(saveErr);
    } else {
      setSaved(true);
      setProfile((prev) =>
        prev
          ? { ...prev, username: username.trim() }
          : { id: user.id, username: username.trim(), neutrons_balance: 0 },
      );
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (!isLoaded || loading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-24 max-w-2xl mx-auto px-8">
          <div className="bg-surface-container rounded-2xl p-8 space-y-6 animate-pulse">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-surface-container-high" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-40 bg-surface-container-high rounded" />
                <div className="h-4 w-56 bg-surface-container-high rounded" />
              </div>
            </div>
            <div className="h-12 bg-surface-container-high rounded-xl" />
            <div className="h-12 bg-surface-container-high rounded-xl" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!isSignedIn || !user) return null;

  const avatarUrl  = user.imageUrl;
  const email      = user.emailAddresses[0]?.emailAddress ?? "";
  const neutrons   = profile?.neutrons_balance ?? 0;

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 max-w-2xl mx-auto px-8">

        {/* Header */}
        <div className="mb-8">
          <span className="text-[10px] font-label text-secondary uppercase tracking-widest">
            Account
          </span>
          <h1 className="font-headline text-4xl font-bold tracking-tight mt-1">
            Profile
          </h1>
        </div>

        {/* Card */}
        <div className="bg-surface-container rounded-2xl p-8 space-y-8">

          {/* Avatar + identity */}
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="rounded-full ring-2 ring-primary/40"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center ring-2 ring-primary/40">
                  <User className="text-on-surface-variant" size={40} />
                </div>
              )}
              {/* Green online dot */}
              <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-secondary shadow-[0_0_6px_#00eefc] border-2 border-surface-container" />
            </div>

            <div>
              <p className="font-headline font-bold text-xl text-on-surface">
                {profile?.username || user.firstName || "—"}
              </p>
              <p className="font-label text-sm text-on-surface-variant mt-0.5">
                {email}
              </p>
              <p className="font-label text-xs text-on-surface-variant/60 mt-1">
                ID: {user.id.slice(0, 20)}…
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-outline-variant/10" />

          {/* Neutrons balance */}
          <div className="flex items-center justify-between bg-surface-container-high rounded-xl px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">⚡</span>
              </div>
              <div>
                <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">
                  Neutrons Balance
                </p>
                <p className="font-headline font-bold text-2xl text-on-surface">
                  {neutrons.toLocaleString()}
                  <span className="text-sm font-label text-on-surface-variant ml-1">NTR</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-label text-xs text-on-surface-variant">
                ≈ {(neutrons / 100).toFixed(2)} USDT
              </p>
              <p className="font-label text-[10px] text-on-surface-variant/50 mt-0.5">
                1 USDT = 100 NTR
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-outline-variant/10" />

          {/* Username edit */}
          <div className="space-y-3">
            <label className="block font-label text-sm text-on-surface-variant uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <Square className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={32}
                placeholder="اختر اسم مستخدم..."
                className="w-full bg-surface-container-high ring-1 ring-white/10 hover:ring-primary/30 focus:ring-primary/60 outline-none transition-all duration-200 pl-11 pr-4 py-3 rounded-xl text-on-surface font-label placeholder:text-on-surface-variant/40"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 font-label text-xs">
                {username.length}/32
              </span>
            </div>

            {/* Error */}
            {error && (
              <p className="text-error font-label text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </p>
            )}
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving || !username.trim()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary py-3 rounded-xl font-headline font-bold text-sm tracking-tight hover:shadow-[0_0_30px_rgba(219,144,255,0.25)] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                جارٍ الحفظ...
              </>
            ) : saved ? (
              <>
                <CheckCircle2 size={18} />
                تم الحفظ ✅
              </>
            ) : (
              <>
                <Square size={18} />
                حفظ التغييرات
              </>
            )}
          </button>

        </div>

        {/* SQL hint (dev note) */}
        <p className="text-center text-on-surface-variant/40 font-label text-xs mt-6">
          إذا لم يعمل الحفظ، تأكد من وجود جدول <code className="text-primary/70">profiles</code> في Supabase
        </p>

      </main>

      <Footer />
    </>
  );
}
