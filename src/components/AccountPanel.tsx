"use client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabaseClient } from "@/lib/supabase";
import { listReadings, saveReading, removeReading, exportReadings, type ReadingPayload, type ReadingRow } from "@/lib/readings";
import { ShieldCheck, LogOut, Trash2, Save, UserRound, Download, KeyRound } from "lucide-react";

export type { ReadingPayload } from "@/lib/readings";
export default function AccountPanel({pending}:{pending:ReadingPayload|null}) {
  const [user,setUser]=useState<User|null>(null);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [mode,setMode]=useState<"login"|"register"|"reset"|"new-password">("login");
  const [rows,setRows]=useState<ReadingRow[]>([]);
  const [consent,setConsent]=useState(false);
  const [acceptPrivacy,setAcceptPrivacy]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const client=supabaseClient();
  const registrationEnabled=process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === "true";
  useEffect(()=>{
    // Recovery links created by Supabase carry type=recovery in the URL fragment.
    const isRecovery = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";
    // Must run after hydration: window is unavailable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if(isRecovery)setMode("new-password");
  },[]);
  const [consentFor,setConsentFor]=useState(pending);
  if(consentFor!==pending){setConsentFor(pending);setConsent(false);}
  useEffect(()=>{
    const supabase=supabaseClient();if(!supabase)return;
    let active=true;
    supabase.auth.getUser().then(({data,error})=>{
      if(active&&!error)setUser(data.user);
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
      if(active){setUser(session?.user??null);setRows([]);if(_event === "PASSWORD_RECOVERY")setMode("new-password");}
    });
    return()=>{active=false;subscription.unsubscribe()};
  },[]);
  useEffect(()=>{
    const supabase=supabaseClient(); if(!supabase||!user)return;
    let active=true;
    listReadings(supabase,user.id).then(data=>{if(active)setRows(data)})
      .catch(error=>{if(active)setMessage("No se pudo cargar el historial: "+String(error.message??error))});
    return()=>{active=false};
  },[user]);
  async function authenticate(e:React.FormEvent){
    e.preventDefault();if(!client)return;
    if(mode === "register" && !registrationEnabled){setMessage("El registro público todavía está cerrado.");return;}
    if(mode === "register" && !acceptPrivacy){setMessage("Para registrarte debés aceptar la política de privacidad cuando esté publicada.");return;}
    setBusy(true);setMessage("");
    try{
      if(mode === "reset") {
        const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+"/#cuenta"});
        if(error)throw error;
        setMessage("Si el correo está registrado, recibirás instrucciones para recuperar tu acceso.");
        return;
      }
      if(mode === "new-password") {
        const {error}=await client.auth.updateUser({password});
        if(error)throw error;
        setPassword("");setMode("login");
        window.history.replaceState(null,"",window.location.pathname+window.location.search+"#cuenta");
        setMessage("Contraseña actualizada. Ya podés iniciar sesión.");
        return;
      }
      const result=mode==="register"
        ?await client.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin+"/#cuenta"}})
        :await client.auth.signInWithPassword({email,password});
      if(result.error)throw result.error;
      setPassword("");
      setMessage(mode==="register"&&!result.data.session?"Revisá tu correo y confirmá la cuenta para ingresar.":"Solicitud procesada. Revisá el estado de tu sesión.");
    }catch(e){setMessage(e instanceof Error?e.message:"No fue posible iniciar sesión.")}finally{setBusy(false)}
  }
  async function save(){
    if(!client||!user||!pending||!consent)return;
    setBusy(true);setMessage("");
    try{
      const data=await saveReading(client,user.id,pending);
      setRows(old=>[data,...old].slice(0,30));setMessage("Consulta guardada en tu cuenta.");setConsent(false);
    }catch(e){setMessage(e instanceof Error?e.message:"No se pudo guardar.")}finally{setBusy(false)}
  }
  async function exportHistory(){
    if(!client||!user)return;
    setBusy(true);setMessage("");
    try {
      const all=await exportReadings(client,user.id);
      const json=JSON.stringify({exportedAt:new Date().toISOString(),readings:all},null,2);
      const url=URL.createObjectURL(new Blob([json],{type:"application/json;charset=utf-8"}));
      const link=document.createElement("a");link.href=url;link.download="astro-mis-consultas.json";link.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      setMessage(`Exportación preparada: ${all.length} consultas.`);
    }catch(e){setMessage(e instanceof Error?e.message:"No se pudo exportar.")}finally{setBusy(false)}
  }
  async function erase(id:string){
    if(!client||!user||!window.confirm("¿Eliminar definitivamente esta consulta?"))return;
    setBusy(true);setMessage("");
    try{
      await removeReading(client,user.id,id);
      setRows(old=>old.filter(r=>r.id!==id));setMessage("Consulta eliminada.");
    }catch(e){setMessage(e instanceof Error?e.message:"No se pudo eliminar.")}finally{setBusy(false)}
  }
  return <section id="cuenta" className="section container account-section">
    <div className="section-heading"><span className="kicker"><UserRound size={16}/> MI ESPACIO</span><h2>Tu universo, <em>a tu ritmo.</em></h2>
      <p>Creá una cuenta opcional para conservar tus lecturas. Las consultas solo se guardan cuando lo autorizás expresamente.</p></div>
    <div className="account-panel">
    {!client?<div className="account-notice"><ShieldCheck/><div><strong>Cuentas disponibles al conectar Supabase</strong><p>El Tarot y la numerología funcionan sin registrarte. Para activar cuentas, configurá la clave pública del proyecto Supabase autorizado y sus variables de entorno según el README.</p></div></div>
    :(!user||mode==="new-password")?<form className="account-form" onSubmit={authenticate}>
      <h3>{mode==="login"?"Ingresar a mi cuenta":mode==="register"?"Crear mi cuenta":mode==="reset"?"Recuperar acceso":"Elegir nueva contraseña"}</h3>
      {mode!=="new-password"&&<><label htmlFor="auth-email">Correo electrónico</label><input id="auth-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/></>}
      {mode!=="reset"&&<><label htmlFor="auth-password">Contraseña (mínimo 12 caracteres)</label><input id="auth-password" type="password" autoComplete={mode==="login"?"current-password":"new-password"} required minLength={12} value={password} onChange={e=>setPassword(e.target.value)}/></>}
      {mode==="register"&&<label className="consent-label"><input type="checkbox" required checked={acceptPrivacy} onChange={e=>setAcceptPrivacy(e.target.checked)}/> Confirmo que he leído la política de privacidad publicada. No habilitar registro público hasta contar con ella.</label>}
      <button type="submit" className="btn btn-primary" disabled={busy}>{busy?"Procesando…":mode==="login"?"Ingresar":mode==="register"?"Registrarme":mode==="reset"?"Enviar enlace":"Actualizar contraseña"}</button>
      <button type="button" className="link-button" disabled={mode==="login"&&!registrationEnabled} onClick={()=>{setMode(mode==="login"?"register":"login");setMessage("")}}>{mode==="login"?"¿No tenés cuenta? Registrate":"Volver al ingreso"}</button>
      {mode==="login"&&<button type="button" className="link-button" onClick={()=>{setMode("reset");setMessage("")}}><KeyRound size={15}/> Olvidé mi contraseña</button>}
      <p className="account-help">El registro público está deshabilitado por defecto hasta completar la documentación legal, eliminación de cuentas y pruebas de seguridad.</p>
    </form>:<div className="account-content"><div className="account-bar"><div><strong>Sesión activa</strong><p>{user.email}</p></div><button type="button" className="btn btn-ghost" onClick={async()=>{await client.auth.signOut();setMessage("Sesión cerrada.")}}><LogOut size={16}/> Salir</button></div>
      {pending?<div className="save-panel"><strong>Guardar {pending.kind==="tarot"?"esta tirada":"este resultado numerológico"}</strong>
        <p>{pending.kind==="numerology"?"Incluye nombre, fecha de nacimiento y resultados numéricos; guardalos solo si lo deseás.":"Incluye las cartas y sus significados."}</p>
        <label className="consent-label"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> Autorizo expresamente guardar esta consulta en mi cuenta hasta que la elimine.</label>
        <button type="button" className="btn btn-primary" disabled={!consent||busy} onClick={save}><Save size={16}/> Guardar consulta</button></div>:<p>Realizá una tirada de Tarot o un cálculo de numerología para habilitar el guardado.</p>}
      <div className="account-bar"><h3>Mis últimas consultas</h3><button type="button" className="btn btn-ghost" disabled={busy} onClick={exportHistory}><Download size={16}/> Exportar mis datos</button></div>{rows.length===0?<p>Todavía no tenés consultas guardadas.</p>:<ul className="history-list">{rows.map(r=><li key={r.id}><div><strong>{r.title}</strong><small>{new Date(r.created_at).toLocaleDateString("es-AR")} · {r.kind==="tarot"?"Tarot":"Numerología"}</small><details><summary>Ver contenido guardado</summary><pre>{JSON.stringify(r.payload,null,2)}</pre></details></div><button aria-label={"Eliminar "+r.title} type="button" disabled={busy} onClick={()=>erase(r.id)}><Trash2 size={17}/></button></li>)}</ul>}
      <p className="account-help">Podés eliminar consultas individuales. La eliminación completa de cuenta y datos asociados todavía está pendiente y debe implementarse antes de abrir registros públicos.</p>
    </div>}
    {message&&<p className="account-message" role="status">{message}</p>}
    </div>
  </section>;
}
