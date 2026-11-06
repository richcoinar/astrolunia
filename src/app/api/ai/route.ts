import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
export const runtime='nodejs';
const PROJECT_URL='https://bdhwkvlpnixfamsvjfco.supabase.co';
const response=(message:string,status:number)=>NextResponse.json({error:message},{status,headers:{'Cache-Control':'no-store'}});
export async function POST(req:NextRequest){
 const origin=req.headers.get('origin');
 const expected=process.env.NEXT_PUBLIC_SITE_ORIGIN;
 if(expected && origin && origin!==expected) return response('Origen no permitido',403);
 const type=req.headers.get('content-type')??'';
 if(!type.startsWith('application/json'))return response('Se requiere JSON',415);
 const length=Number(req.headers.get('content-length')??0);
 if(length>8192)return response('Solicitud demasiado grande',413);
 const bearer=req.headers.get('authorization')??'';
 if(!/^Bearer [A-Za-z0-9._~+/-]+={0,2}$/.test(bearer))return response('Iniciá sesión para utilizar IA',401);
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(process.env.NEXT_PUBLIC_SUPABASE_URL!==PROJECT_URL || !key)return response('Supabase no está configurado',503);
 const token=bearer.slice(7);
 const client=createClient(PROJECT_URL,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:{headers:{Authorization:`Bearer ${token}`}}});
 const {data:{user},error:authError}=await client.auth.getUser(token);
 if(authError||!user)return response('Sesión no válida',401);
 let message:unknown;
 try{const body=await req.json();message=body?.message;}catch{return response('JSON inválido',400)}
 if(typeof message!=='string'||message.trim().length<5||message.length>1200)return response('La consulta debe tener entre 5 y 1200 caracteres',400);
 // Nunca se envían datos del perfil ni de cartas al proveedor; el usuario decide qué escribe.
 const aiKey=process.env.OPENAI_API_KEY;
 if(!aiKey || process.env.ASTROLUNIA_AI_ENABLED!=='true')return response('El asistente IA aún no está habilitado',503);
 // Consumo atómico administrado por PostgreSQL con auth.uid().
 const {data:credit,error:quotaError}=await client.rpc('astro_consume_ai_credit');
 if(quotaError)return response('No se pudo verificar la cuota de IA',503);
 const info=Array.isArray(credit)?credit[0]:credit;
 if(!info?.allowed)return response('Alcanzaste tu cuota mensual de IA',429);
 try{
  const upstream=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${aiKey}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4.1-mini',store:false,max_output_tokens:350,instructions:'Sos un asistente de entretenimiento simbólico para ASTROLUNIA. Respondé en español, con respeto, sin afirmaciones de predicción científica. No des consejos médicos, legales o financieros personalizados, no prometas resultados ni presentes astrología como ciencia predictiva. Sé breve.',input:message.trim()}),signal:AbortSignal.timeout(18000)});
  if(!upstream.ok)return response('El proveedor IA no respondió correctamente. La consulta puede haber consumido un crédito.',502);
  const json=await upstream.json();
  const content=(json.output??[]).flatMap((x:{content?:{type?:string,text?:string}[]})=>x.content??[]).filter((x:{type?:string})=>x.type==='output_text').map((x:{text?:string})=>x.text??'').join('\n').trim();
  if(!content)return response('La respuesta IA llegó vacía',502);
  return NextResponse.json({answer:content,used:info.used,limit:info.monthly_limit},{headers:{'Cache-Control':'no-store'}});
 }catch{return response('El asistente no está disponible. La consulta puede haber consumido un crédito.',502)}
}
