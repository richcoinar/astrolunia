'use client';
import {useState} from 'react';
import {supabaseClient} from '@/lib/supabase';
export default function AiAssistantPanel(){
 const [message,setMessage]=useState('');const [answer,setAnswer]=useState('');const [status,setStatus]=useState('');const [busy,setBusy]=useState(false);
 const submit=async(e:React.FormEvent)=>{e.preventDefault();setAnswer('');setStatus('');setBusy(true);
  try{const client=supabaseClient();if(!client)throw new Error('Supabase no está configurado.');const {data:{session}}=await client.auth.getSession();if(!session)throw new Error('Iniciá sesión en Mi cuenta para usar la IA.');
   const result=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({message})});const json=await result.json();if(!result.ok)throw new Error(json.error||'No se pudo responder');setAnswer(json.answer);setStatus(`Consultas usadas: ${json.used} de ${json.limit} este mes.`);
  }catch(err){setStatus(err instanceof Error?err.message:'Error desconocido.');}finally{setBusy(false)}
 };
 return <section className="section container" id="ia"><div className="section-heading"><span className="kicker">ASISTENTE IA · FREEMIUM</span><h2>Preguntale a <em>Astrolunia.</em></h2><p>Disponible para cuentas autenticadas cuando el operador active el servicio. Incluye 3 consultas mensuales gratis y hasta 100 para Premium. No compartas información sensible.</p></div><form className="num-form" onSubmit={submit}><label htmlFor="ai-message">Tu consulta simbólica</label><textarea id="ai-message" rows={4} maxLength={1200} minLength={5} value={message} onChange={e=>setMessage(e.target.value)} required placeholder="¿Qué representa el arquetipo de La Estrella?"/><button className="btn btn-primary" disabled={busy} type="submit">{busy?'Consultando…':'Consultar IA'}</button>{status&&<p role="status">{status}</p>}{answer&&<div role="status" style={{whiteSpace:'pre-wrap'}}>{answer}</div>}<small>Tu texto se envía al proveedor de IA al pulsar Consultar. No guardamos la conversación en nuestra base de datos; el proveedor procesa la consulta conforme a sus condiciones.</small></form></section>;
}
