"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import StudyShell from "@/components/study-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setIsError(true); setMessage("Passwords do not match."); return; }
    if (password.length < 6) { setIsError(true); setMessage("Password must be at least 6 characters."); return; }

    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) { setLoading(false); setIsError(true); setMessage(error.message); return; }
    if (data.session) { router.push("/"); return; }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (!signInError) {
      router.push("/");
    } else {
      setIsError(false);
      setMessage("Account created! Check your email to confirm before logging in.");
      setEmail(""); setPassword(""); setConfirmPassword("");
    }
  };

  return (
    <StudyShell>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle>Create Account</CardTitle>
              <Badge variant="red">New Trainer</Badge>
            </div>
            <CardDescription>
              Join PomoPet to track focused sessions and task progress.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="trainer@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password (min 6 characters)</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              {message && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={[
                    "border-[2px] p-3",
                    isError
                      ? "border-[var(--poke-red)] bg-[rgba(224,64,56,0.08)]"
                      : "border-[var(--poke-green)] bg-[rgba(120,200,80,0.08)]",
                  ].join(" ")}
                >
                  <p className={[
                    "font-pixel-body text-[18px]",
                    isError ? "text-[var(--poke-red)]" : "text-[var(--poke-green)]",
                  ].join(" ")}>
                    {message}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Creating account…" : "Create Account"}
              </Button>
            </form>

            <p className="font-pixel-body text-[18px] text-[var(--text-muted)] text-center mt-4">
              Already a trainer?{" "}
              <Link href="/login" className="text-[var(--poke-blue)] hover:underline">
                Login here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </StudyShell>
  );
}
