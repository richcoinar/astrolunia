"use client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabase";
import { ShieldCheck, LogOut, Trash2, Save, UserRound } from "lucide-react";

export type ReadingPayload = {kind:"tarot"|"numerology"; title:string; payload: Record<string,unknown>};
type ReadingRow = {id:string; kind:string; title:string; created_at:string; payload:Record<string,unknown>};
export default function AccountPanel({pending}:{pending:ReadingPayload|null}) {
  const [user,setUser]=useState<User|null>(null);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [mode,setMode]=useState<"login"|"register">("login");
  const [rows,setRows]=useState<ReadingRow[]>([]);
  const [consent,setConsent]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const client=supabaseClient();
  useEffect(()=>{setConsent(false)},[pending]);
  useEffect(()=>{
    const supabase=supabaseClient();if(!supabase)return;
    let active=true;
    supabase.auth.getUser().then(({data,error})=>{
      if(active&&!error)setUser(data.user);
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
      if(active){setUser(session?.user??null);setRows([]);}
    });
    return()=>{active=false;subscription.unsubscribe()};
  },[]);
  useEffect(()=>{
    const supabase=supabaseClient();if(!supabase||!user)return;
    let active=true;
    supabase.from("astro_readings").select("id,kind,title,payload,created_at")
      .order("created_at",{ascending:false}).limit(30)
      .then(({data,error})=>{if(active){if(error)setMessage("No se pudo cargar el historial: "+error.message);else setRows((data??[]) as ReadingRow[])}});
    return()=>{active=false};
  },[user]);
  async function authenticate(e:React.FormEvent){
    e.preventDefault();if(!client)return;
    setBusy(true);setMessage("");
    try{
      const result=mode==="register"
        ?await client.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin+"/#cuenta"}})
        :await client.auth.signInWithPassword({email,password});
      if(result.error)throw result.error;
      setPassword("");
      setMessage(mode==="register"&&!result.data.session?"Revisá tu correo y confirmá la cuenta para ingresar.":"Sesión iniciada.");
    }catch(e){setMessage(e instanceof Error?e.message:"No fue posible iniciar sesión.")}finally{setBusy(false)}
  }
  async function save(){
    if(!client||!user||!pending||!consent)return;
    setBusy(true);setMessage("");
    try{
      const {data,error}=await client.from("astro_readings").insert({user_id:user.id,kind:pending.kind,title:pending.title,payload:pending.payload})
        .select("id,kind,title,payload,created_at").single();
      if(error)throw error;
      setRows(old=>[data as ReadingRow,...old].slice(0,30));setMessage("Consulta guardada en tu cuenta.");setConsent(false);
    }catch(e){setMessage(e instanceof Error?e.message:"No se pudo guardar.")}finally{setBusy(false)}
  }
  async function erase(id:string){
    if(!client||!user||!window.confirm("¿Eliminar definitivamente esta consulta?"))return;
    setBusy(true);setMessage("");
    try{
      const {error}=await client.from("astro_readings").delete().eq("id",id).eq("user_id",user.id);
      if(error)throw error;
      setRows(old=>old.filter(r=>r.id!==id));setMessage("Consulta eliminada.");
    }catch(e){setMessage(e instanceof Error?e.message:"No se pudo eliminar.")}finally{setBusy(false)}
  }
  return <section id="cuenta" className="section container account-section">
    <div className="section-heading"><span className="kicker"><UserRound size={16}/> MI ESPACIO</span><h2>Tu universo, <em>a tu ritmo.</em></h2>
      <p>Creá una cuenta opcional para conservar tus lecturas. Las consultas solo se guardan cuando lo autorizás expresamente.</p></div>
    <div className="account-panel">
    {!client?<div className="account-notice"><ShieldCheck/><div><strong>Cuentas disponibles al conectar Supabase</strong><p>El Tarot y la numerología funcionan sin registrarte. Para activar cuentas, configurá un proyecto Supabase independiente y sus variables de entorno según el README.</p></div></div>
    :!user?<form className="account-form" onSubmit={authenticate}>
      <h3>{mode==="login"?"Ingresar a mi cuenta":"Crear mi cuenta"}</h3>
      <label htmlFor="auth-email">Correo electrónico</label><input id="auth-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/>
      <label htmlFor="auth-password">Contraseña (mínimo 8 caracteres)</label><input id="auth-password" type="password" autoComplete={mode==="login"?"current-password":"new-password"} required minLength={8} value={password} onChange={e=>setPassword(e.target.value)}/>
      <button type="submit" className="btn btn-primary" disabled={busy}>{busy?"Procesando…":mode==="login"?"Ingresar":"Registrarme"}</button>
      <button type="button" className="link-button" onClick={()=>{setMode(mode==="login"?"register":"login");setMessage("")}}>{mode==="login"?"¿No tenés cuenta? Registrate":"Ya tengo cuenta"}</button>
      <p className="account-help">Al registrarte aceptás utilizar este espacio de entretenimiento simbólico. Antes de abrir registros públicos hay que publicar términos y una política de privacidad completa.</p>
    </form>:<div className="account-content"><div className="account-bar"><div><strong>Sesión activa</strong><p>{user.email}</p></div><button type="button" className="btn btn-ghost" onClick={async()=>{await client.auth.signOut();setMessage("Sesión cerrada.")}}><LogOut size={16}/> Salir</button></div>
      {pending?<div className="save-panel"><strong>Guardar {pending.kind==="tarot"?"esta tirada":"este resultado numerológico"}</strong>
        <p>{pending.kind==="numerology"?"Incluye nombre, fecha de nacimiento y resultados numéricos; guardalos solo si lo deseás.":"Incluye las cartas y sus significados."}</p>
        <label className="consent-label"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> Autorizo expresamente guardar esta consulta en mi cuenta hasta que la elimine.</label>
        <button type="button" className="btn btn-primary" disabled={!consent||busy} onClick={save}><Save size={16}/> Guardar consulta</button></div>:<p>Realizá una tirada de Tarot o un cálculo de numerología para habilitar el guardado.</p>}
      <h3>Mis últimas consultas</h3>{rows.length===0?<p>Todavía no tenés consultas guardadas.</p>:<ul className="history-list">{rows.map(r=><li key={r.id}><div><strong>{r.title}</strong><small>{new Date(r.created_at).toLocaleDateString("es-AR")} · {r.kind==="tarot"?"Tarot":"Numerología"}</small><details><summary>Ver contenido guardado</summary><pre>{JSON.stringify(r.payload,null,2)}</pre></details></div><button aria-label={"Eliminar "+r.title} type="button" disabled={busy} onClick={()=>erase(r.id)}><Trash2 size={17}/></button></li>)}</ul>}
      <p className="account-help">Podés eliminar consultas individuales. La eliminación de la cuenta completa debe implementarse y documentarse antes del lanzamiento público.</p>
    </div>}
    {message&&<p className="account-message" role="status">{message}</p>}
    </div>
  </section>;
}
