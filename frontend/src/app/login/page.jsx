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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setIsError(true);
      setMessage(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <StudyShell>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle>Welcome Back</CardTitle>
              <Badge variant="blue">Trainer Login</Badge>
            </div>
            <CardDescription>Continue your focus streak.</CardDescription>
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? "Logging in…" : "Login"}
              </Button>
            </form>

            <p className="font-pixel-body text-[18px] text-[var(--text-muted)] text-center mt-4">
              No account?{" "}
              <Link href="/register" className="text-[var(--poke-blue)] hover:underline">
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </StudyShell>
  );
}
