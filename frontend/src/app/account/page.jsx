"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import { clearGuestData } from "@/lib/guest-storage";
import StudyShell from "@/components/study-shell";

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return (
      <StudyShell>
        <div className="pokemon-window">
          <p className="pixel-text">Loading…</p>
        </div>
      </StudyShell>
    );
  }

  if (!user) {
    return (
      <StudyShell>
        <div className="pokemon-window">
          <h2 className="pixel-heading">Not logged in</h2>
          <p className="pixel-text mt-3 text-muted">
            Please{" "}
            <Link href="/login" className="pokemon-nav-link">
              log in
            </Link>{" "}
            to access account settings.
          </p>
        </div>
      </StudyShell>
    );
  }

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") return;

    setDeleting(true);
    setError("");

    const { error: rpcError } = await supabase.rpc("delete_own_account");

    if (rpcError) {
      setDeleting(false);
      setError(rpcError.message);
      return;
    }

    // Clean up: sign out and wipe local guest data, then go home
    await signOut();
    clearGuestData();
    router.push("/");
  };

  return (
    <StudyShell>
      <div className="pokemon-window" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <span className="pokemon-badge pokemon-badge-red">Account Settings</span>

        {/* User info */}
        <div className="pokemon-window-inner mt-4">
          <p className="pixel-heading-sm">Trainer Info</p>
          <p className="pixel-text mt-2" style={{ color: "var(--poke-blue)" }}>
            {user.email}
          </p>
        </div>

        {/* Danger zone */}
        <div
          className="pokemon-window-inner mt-4"
          style={{ borderColor: "var(--poke-red)" }}
        >
          <p className="pixel-heading-sm" style={{ color: "var(--poke-red)" }}>
            Danger Zone
          </p>
          <p className="pixel-text mt-2 text-muted">
            Permanently delete your account and all your saved data. This
            cannot be undone.
          </p>

          <div className="mt-3">
            <p className="pixel-text-sm mb-2">
              Type <strong>DELETE</strong> to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="pokemon-input"
              placeholder="DELETE"
              style={{ width: "160px", marginBottom: "12px" }}
            />
          </div>

          {error && (
            <p
              className="pixel-text-sm mt-2"
              style={{ color: "var(--poke-red)" }}
            >
              {error}
            </p>
          )}

          <button
            className="pokemon-btn pokemon-btn-red"
            onClick={handleDeleteAccount}
            disabled={confirmText !== "DELETE" || deleting}
          >
            {deleting ? "Deleting…" : "Delete My Account"}
          </button>
        </div>
      </div>
    </StudyShell>
  );
}
