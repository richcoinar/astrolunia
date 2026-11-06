/** Interpretación de una hora civil de nacimiento con zonas horarias IANA.
 * No genera carta astral ni posiciones planetarias. Sin red ni geolocalización.
 * Solo fechas modernas (1900-2100); depende de la base tz del entorno.
 */
export type BirthTimeResult =
 | {ok:true;utcISO:string;offsetMinutes:number;zone:string;localDate:string;localTime:string}
 | {ok:false;reason:'date'|'time'|'zone'|'nonexistent'|'ambiguous'|'range'};

function civilParts(instant:Date,zone:string){
 const dtf=new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 const p=Object.fromEntries(dtf.formatToParts(instant).filter(x=>x.type!=='literal').map(x=>[x.type,Number(x.value)]));
 return `${p.year}-${String(p.month).padStart(2,'0')}-${String(p.day).padStart(2,'0')}T${String(p.hour).padStart(2,'0')}:${String(p.minute).padStart(2,'0')}`;
}
function offsetMinutes(instant:Date,zone:string){
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:zone,timeZoneName:'shortOffset'}).formatToParts(instant);
 const name=parts.find(p=>p.type==='timeZoneName')?.value;
 if(!name)throw new RangeError('Offset no disponible');
 if(name==='GMT'||name==='UTC')return 0;
 const match=/^(?:GMT|UTC)([+-])(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?$/.exec(name);
 if(!match)throw new RangeError('Offset no interpretable');
 const seconds=Number(match[4]??0);
 if(seconds!==0)throw new RangeError('Offset histórico con segundos no soportado');
 return (match[1]==='-'?-1:1)*(Number(match[2])*60+Number(match[3]??0));
}
export function resolveBirthTime(date:string,time:string,zone:string):BirthTimeResult{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return {ok:false,reason:'date'};
 const [year,month,day]=date.split('-').map(Number);
 if(year<1900||year>2100)return {ok:false,reason:'range'};
 const check=new Date(Date.UTC(year,month-1,day));
 if(check.getUTCFullYear()!==year||check.getUTCMonth()!==month-1||check.getUTCDate()!==day)return {ok:false,reason:'date'};
 if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))return {ok:false,reason:'time'};
 if(!zone||zone.length>100)return {ok:false,reason:'zone'};
 try{
  new Intl.DateTimeFormat('en-US',{timeZone:zone}).format(new Date());
  const [hour,minute]=time.split(':').map(Number);
  const naive=Date.UTC(year,month-1,day,hour,minute);
  // Muestreo de offsets alrededor de la fecha civil para capturar cambios de horario.
  const offsets=new Set<number>();
  for(let shift=-48;shift<=48;shift+=6)offsets.add(offsetMinutes(new Date(naive+shift*3600000),zone));
  const candidates=[...offsets].map(offset=>({instant:new Date(naive-offset*60000),offset}))
   .filter(c=>civilParts(c.instant,zone)===`${date}T${time}`);
  if(!candidates.length)return {ok:false,reason:'nonexistent'};
  if(candidates.length>1)return {ok:false,reason:'ambiguous'};
  return {ok:true,utcISO:candidates[0].instant.toISOString(),offsetMinutes:candidates[0].offset,zone,localDate:date,localTime:time};
 }catch{return {ok:false,reason:'zone'}}
}
