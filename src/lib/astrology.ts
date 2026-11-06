import * as Astronomy from 'astronomy-engine';

const names = ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo','Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis'] as const;
export type Zodiac = typeof names[number];
export const zodiacNames = names;
export const norm = (deg: number) => ((deg % 360) + 360) % 360;
export const signOf = (longitude: number): Zodiac => names[Math.floor(norm(longitude) / 30)];
export const signedDistance = (a:number,b:number) => Math.abs(((norm(a-b)+180)%360)-180);
export type PlanetName = 'Sol'|'Luna'|'Mercurio'|'Venus'|'Marte'|'Júpiter'|'Saturno'|'Urano'|'Neptuno'|'Plutón';
export type PlanetPosition = {name:PlanetName; longitude:number; sign:Zodiac; degreeInSign:number};
export type Aspect = {between:[PlanetName,PlanetName]; type:'Conjunción'|'Sextil'|'Cuadratura'|'Trígono'|'Oposición'; orb:number};
const bodies: [PlanetName, Astronomy.Body][] = [
 ['Sol',Astronomy.Body.Sun], ['Luna',Astronomy.Body.Moon],['Mercurio',Astronomy.Body.Mercury],
 ['Venus',Astronomy.Body.Venus], ['Marte',Astronomy.Body.Mars], ['Júpiter',Astronomy.Body.Jupiter],
 ['Saturno',Astronomy.Body.Saturn],['Urano',Astronomy.Body.Uranus], ['Neptuno',Astronomy.Body.Neptune],['Plutón',Astronomy.Body.Pluto],
];
export function planetPositions(date: Date): PlanetPosition[] {
 if (!Number.isFinite(date.getTime())) throw new Error('Fecha UTC inválida');
 return bodies.map(([name, body]) => {
  // GeoVector + Ecliptic entrega la longitud geocéntrica aparente, no heliocéntrica.
  const longitude = norm(Astronomy.Ecliptic(Astronomy.GeoVector(body,date,true)).elon);
  return {name,longitude,sign:signOf(longitude),degreeInSign:longitude%30};
 });
}
export function ascendant(date:Date,lat:number,lon:number):number {
 if (!(lat > -89.9 && lat < 89.9 && lon >= -180 && lon <= 180)) throw new Error('Coordenadas fuera del rango admitido (latitud inferior a 89,9°).');
 const localSidereal = norm(Astronomy.SiderealTime(date)*15 + lon)*Math.PI/180;
 const phi = lat*Math.PI/180;
 // Oblicuidad media aproximada; usada solo para el ascendente y casas iguales.
 const t = (date.getTime()-Date.UTC(2000,0,1,12))/(36525*86400000);
 const epsilon = (23.4392911-0.0130042*t)*Math.PI/180;
 return norm(Math.atan2(-Math.cos(localSidereal),Math.sin(localSidereal)*Math.cos(epsilon)+Math.tan(phi)*Math.sin(epsilon))*180/Math.PI);
}
export function aspectsOf(positions:PlanetPosition[]):Aspect[] {
 const types = [ ['Conjunción',0,8],['Sextil',60,5],['Cuadratura',90,6],['Trígono',120,6],['Oposición',180,8] ] as const;
 const output:Aspect[]=[];
 for(let i=0;i<positions.length;i++) for(let j=i+1;j<positions.length;j++) {
  const separation=signedDistance(positions[i].longitude,positions[j].longitude);
  const match=types.map(([type,degree,maxOrb])=>({type,orb:Math.abs(separation-degree),maxOrb})).filter(x=>x.orb<=x.maxOrb).sort((a,b)=>a.orb-b.orb)[0];
  if(match) output.push({between:[positions[i].name,positions[j].name],type:match.type,orb:Number(match.orb.toFixed(2))});
 }
 return output.sort((a,b)=>a.orb-b.orb);
}
export function birthChart(utcISO:string,latitude:number,longitude:number) {
 const date = new Date(utcISO);
 if(!Number.isFinite(date.getTime()) || !Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error('Datos natales inválidos.');
 if(date.getUTCFullYear()<1900 || date.getUTCFullYear()>2100) throw new Error('Año natal fuera del rango 1900–2100.');
 const positions=planetPositions(date); const rising=ascendant(date,latitude,longitude);
 return {utcISO:date.toISOString(),latitude,longitude,positions,ascendant:rising,ascendingSign:signOf(rising),
  houseSystem:'Casas iguales (simplificado)',houses:Array.from({length:12},(_,i)=>norm(rising+i*30)),aspects:aspectsOf(positions),
  ephemeris:'astronomy-engine · longitudes geocéntricas tropicales'};
}
