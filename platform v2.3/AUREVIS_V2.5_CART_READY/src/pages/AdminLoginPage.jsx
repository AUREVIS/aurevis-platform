import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLoginPage() {
  const { configured, user, isAdmin, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user && isAdmin) return <Navigate to="/admin" replace />;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    if (user) await signOut();
    const result = await signIn(email.trim(), password);
    if (result.error) setError("Admin email-ը կամ գաղտնաբառը սխալ է։");
    else navigate("/admin", { replace: true });
    setBusy(false);
  }

  return (
    <section className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <img src="/assets/logo.png" alt="AUREVIS" />
        <LockKeyhole size={30} />
        <p className="eyebrow">PRIVATE ACCESS</p>
        <h1>AUREVIS Admin</h1>
        <p>Այս էջը միայն կառավարման հաշվի համար է։</p>
        {!configured && <p className="form-message error">Supabase-ը դեռ միացված չէ։</p>}
        <label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Գաղտնաբառ<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <p className="form-message error">{error}</p>}
        <button className="submit-button" disabled={!configured || busy}>{busy ? "Ստուգվում է…" : "Admin մուտք"}</button>
      </form>
    </section>
  );
}
