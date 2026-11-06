'use client';
import {useState} from 'react';
import {resolveBirthTime} from '@/lib/birth-time';
import {birthChart,type PlanetPosition} from '@/lib/astrology';
import {supabaseClient} from '@/lib/supabase';
import {saveNatalChart,listNatalCharts,deleteNatalChart,type SavedChart} from '@/lib/charts';
type Chart = ReturnType<typeof birthChart>;
const coordsHelp='Ingresá coordenadas decimales: sur y oeste con signo negativo. No se consulta tu ubicación.';
export default function NatalChartPanel(){
 const [saved,setSaved]=useState<SavedChart[]>([]);const [saveStatus,setSaveStatus]=useState('');const [consent,setConsent]=useState(false);
 const [date,setDate]=useState('');const [time,setTime]=useState('');const [zone,setZone]=useState('America/Argentina/Buenos_Aires');
 const [lat,setLat]=useState('-31.5375');const [lon,setLon]=useState('-68.5364');const [chart,setChart]=useState<Chart|null>(null);const [error,setError]=useState('');
 const calculate=async(e:React.FormEvent)=>{e.preventDefault();setError('');setChart(null);
  const resolved=resolveBirthTime(date,time,zone);
  if(!resolved.ok){setError(`No se pudo resolver la hora natal: ${resolved.reason}. Revisá zona y hora local.`);return;}
  try{const {birthChart}=await import('@/lib/astrology');setChart(birthChart(resolved.utcISO,Number(lat),Number(lon)));}catch(err){setError(err instanceof Error?err.message:'Error de cálculo.');}
 };
 const getAccount=async()=>{const client=supabaseClient();if(!client)throw new Error('Configurar Supabase primero.');const {data:{user},error}=await client.auth.getUser();if(error||!user)throw new Error('Iniciá sesión en Mi cuenta.');return {client,user};};
 const save=async()=>{setSaveStatus('');try{if(!chart||!consent)throw new Error('Marcá el consentimiento para guardar tus datos natales.');const {client,user}=await getAccount();await saveNatalChart(client,user.id,'Carta natal '+date,chart);setSaveStatus('Carta guardada en tu cuenta.');setSaved(await listNatalCharts(client,user.id));}catch(e){setSaveStatus(e instanceof Error?e.message:'Error de guardado');}};
 const load=async()=>{setSaveStatus('');try{const {client,user}=await getAccount();setSaved(await listNatalCharts(client,user.id));}catch(e){setSaveStatus(e instanceof Error?e.message:'Error al consultar');}};
 const remove=async(id:string)=>{if(!window.confirm('¿Eliminar esta carta natal guardada?'))return;try{const {client,user}=await getAccount();await deleteNatalChart(client,user.id,id);setSaved(await listNatalCharts(client,user.id));}catch(e){setSaveStatus(e instanceof Error?e.message:'Error al borrar');}};
 const wheel=(items:PlanetPosition[])=> <svg viewBox="0 0 400 400" role="img" aria-label="Rueda natal con 12 signos y posiciones planetarias" style={{width:'100%',maxWidth:420}}>
  <circle cx="200" cy="200" r="174" fill="none" stroke="#bda578" strokeWidth="2"/><circle cx="200" cy="200" r="115" fill="none" stroke="#bda578"/>
  {Array.from({length:12},(_,i)=>{const angle=(i*30-90)*Math.PI/180;return <g key={i}><line x1={200+115*Math.cos(angle)} y1={200+115*Math.sin(angle)} x2={200+174*Math.cos(angle)} y2={200+174*Math.sin(angle)} stroke="#85739c"/><text x={200+147*Math.cos(angle+Math.PI/12)} y={204+147*Math.sin(angle+Math.PI/12)} textAnchor="middle" fill="#e5d3b2" fontSize="11">{i+1}</text></g>})}
  {items.map((p,i)=>{const a=(p.longitude-90)*Math.PI/180;const r=86-(i%3)*14;return <text key={p.name} x={200+r*Math.cos(a)} y={204+r*Math.sin(a)} fontSize="12" textAnchor="middle" fill="#f4d89f">{p.name.slice(0,2)}</text>})}
 </svg>;
 return <section className="section container" id="natal-real"><div className="section-heading"><span className="kicker">CARTA NATAL · EFEMÉRIDES</span><h2>Tu cielo <em>de nacimiento.</em></h2><p>Cálculo geocéntrico de Sol, Luna y planetas, ascendente y aspectos. Coordenadas manuales y casas iguales simplificadas; no equivale a una carta profesional certificada.</p></div>
 <div className="birth-grid"><form className="birth-form" onSubmit={calculate}><label htmlFor="natal-date">Fecha</label><input id="natal-date" type="date" min="1900-01-01" max="2100-12-31" value={date} onChange={e=>setDate(e.target.value)} required/>
 <label htmlFor="natal-time">Hora local</label><input id="natal-time" type="time" value={time} onChange={e=>setTime(e.target.value)} required/>
 <label htmlFor="natal-zone">Zona horaria IANA</label><input id="natal-zone" value={zone} onChange={e=>setZone(e.target.value)} required maxLength={80}/>
 <label htmlFor="natal-lat">Latitud decimal</label><input id="natal-lat" type="number" min="-89.89" max="89.89" step="any" value={lat} onChange={e=>setLat(e.target.value)} required/>
 <label htmlFor="natal-lon">Longitud decimal</label><input id="natal-lon" type="number" min="-180" max="180" step="any" value={lon} onChange={e=>setLon(e.target.value)} required/>
 <small>{coordsHelp} Los valores iniciales son un ejemplo de San Juan (Argentina): cambialos si naciste en otro lugar.</small>
 <button className="btn btn-primary" type="submit">Calcular carta natal</button><small>El cálculo se realiza en el navegador; no se guarda ni envía sin autorización.</small></form>
 <div className="birth-output" aria-live="polite">{error?<p className="birth-error">{error}</p>:chart?<><h3>Ascendente: {chart.ascendingSign}</h3><p>UTC: {chart.utcISO}</p>{wheel(chart.positions)}<ul style={{textAlign:'left'}}>{chart.positions.map(p=><li key={p.name}>{p.name}: {p.sign} {p.degreeInSign.toFixed(1)}°</li>)}</ul><h3>Aspectos</h3><ul style={{textAlign:'left'}}>{chart.aspects.slice(0,15).map((a,i)=><li key={i}>{a.between.join(' – ')}: {a.type} ({a.orb.toFixed(1)}°)</li>)}</ul><small>{chart.houseSystem}. Rueda gráfica simplificada; longitudes referidas a Aries 0°.</small><div><label style={{display:'flex',gap:8,alignItems:'center'}}><input type='checkbox' checked={consent} onChange={e=>setConsent(e.target.checked)}/> Autorizo guardar mis datos natales (fecha, hora, coordenadas y resultados) en Supabase.</label><button type='button' className='btn btn-ghost' onClick={save} disabled={!consent}>Guardar mi carta</button></div></>:<p>Ingresá los datos para visualizar posiciones astronómicas y aspectos.</p>}<div style={{marginTop:20}}><button type='button' className='btn btn-ghost' onClick={load}>Mis cartas guardadas</button>{saveStatus&&<p role='status'>{saveStatus}</p>}{saved.map(item=><div key={item.id} style={{padding:'8px 0',borderBottom:'1px solid #766'}}><strong>{item.title}</strong> · {item.created_at.slice(0,10)} <button type='button' onClick={()=>setChart(item.chart)}>Ver</button> <button type='button' onClick={()=>remove(item.id)}>Eliminar</button></div>)}</div></div></div></section>;
}
