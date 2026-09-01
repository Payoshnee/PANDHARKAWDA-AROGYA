"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(formData: FormData) {
    setError("");
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password")
        })
      });
      if (!response.ok) throw new Error("login failed");
      setSuccess(true);
      router.push("/admin");
    } catch {
      setError("Invalid admin credentials.");
    }
  }

  return <div><h1>Admin Login</h1>{success ? <p className="panel">Login accepted. Redirecting to admin overview...</p> : <form className="form" action={submit}><label className="field"><span>Email</span><input name="email" type="email" defaultValue="admin@arogya.local" required /></label><label className="field"><span>Password</span><input name="password" type="password" defaultValue="ChangeMeLocalDemo!123" required /></label>{error ? <p className="dangerText">{error}</p> : null}<button className="primary" type="submit">Log in</button></form>}</div>;
}
