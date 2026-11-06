import type {SupabaseClient} from '@supabase/supabase-js';
import type {birthChart} from './astrology';
export type NatalChart=ReturnType<typeof birthChart>;
export type SavedChart={id:string;user_id:string;title:string;chart:NatalChart;created_at:string};
const cols='id,user_id,title,chart,created_at';
export function validateChart(title:string,chart:NatalChart){
 if(typeof title!=='string'||title.trim().length<1||title.length>120)throw new Error('Título de carta inválido.');
 if(!chart||typeof chart!=='object'||!Array.isArray(chart.positions)||chart.positions.length!==10||!Number.isFinite(chart.ascendant))throw new Error('Carta natal inválida.');
 if(new TextEncoder().encode(JSON.stringify(chart)).length>30000)throw new Error('Carta demasiado grande.');
}
export async function saveNatalChart(client:SupabaseClient,userId:string,title:string,chart:NatalChart){
 validateChart(title,chart);
 const {data,error}=await client.from('astro_birth_charts').insert({user_id:userId,title:title.trim(),chart}).select(cols).single();
 if(error)throw error;if(!data||data.user_id!==userId)throw new Error('Respuesta de guardado incorrecta');return data as SavedChart;
}
export async function listNatalCharts(client:SupabaseClient,userId:string){
 const {data,error}=await client.from('astro_birth_charts').select(cols).eq('user_id',userId).order('created_at',{ascending:false}).limit(30);
 if(error)throw error;return (data??[]) as SavedChart[];
}
export async function deleteNatalChart(client:SupabaseClient,userId:string,chartId:string){
 const {data,error}=await client.from('astro_birth_charts').delete().eq('id',chartId).eq('user_id',userId).select('id');
 if(error)throw error;if(!data?.length)throw new Error('No se pudo eliminar la carta.');
}
