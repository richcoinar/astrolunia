'use client';
import {useState} from 'react';
import {supabaseClient} from '@/lib/supabase';
import {isAdmin} from '@/lib/entitlements';
type Metrics={total_entitlements:number;premium_active:number;ai_requests_this_month:number;charts_created:number};
export default function AdminPanel(){
 const [metrics,setMetrics]=useState<Metrics|null>(null);const [error,setError]=useState('');const [loading,setLoading]=useState(false);
 const load=async()=>{setLoading(true);setError('');setMetrics(null);try{const client=supabaseClient();if(!client)throw new Error('Supabase sin configurar');const {data:{user},error:authError}=await client.auth.getUser();if(authError||!user||!isAdmin(user.app_metadata))throw new Error('Acceso reservado a administradores asignados por el operador.');
 const {data,error}=await client.rpc('astro_admin_metrics');if(error)throw error;setMetrics((Array.isArray(data)?data[0]:data) as Metrics);}catch(e){setError(e instanceof Error?e.message:'Error desconocido');}finally{setLoading(false)}};
 return <section id="administracion" className="section container"><div className="section-heading"><span className="kicker">ADMINISTRACIÓN · ACCESO RESTRINGIDO</span><h2>Panel de <em>control.</em></h2><p>Estadísticas agregadas sin exponer consultas privadas ni fechas de nacimiento. Solo accesible a usuarios con permiso administrativo del servidor.</p></div><div className="num-form"><button className="btn btn-ghost" onClick={load} disabled={loading} type="button">{loading?'Cargando…':'Consultar estadísticas (solo administrador)'}</button>{error&&<p role="alert">{error}</p>}{metrics&&<dl><dt>Cuentas con perfil de plan</dt><dd>{metrics.total_entitlements}</dd><dt>Premium activas</dt><dd>{metrics.premium_active}</dd><dt>Consultas IA este mes</dt><dd>{metrics.ai_requests_this_month}</dd><dt>Cartas guardadas</dt><dd>{metrics.charts_created}</dd></dl>}</div></section>;
}
