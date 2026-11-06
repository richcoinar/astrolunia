import {planetPositions,signOf,zodiacNames,norm,type Zodiac} from './astrology';
const subjects = [
 'Escuchá las distintas perspectivas antes de elegir tu próximo paso.',
 'Reservá un momento para ordenar tus prioridades y tu energía.',
 'La creatividad puede ayudarte a reformular un desafío cotidiano.',
 'Una conversación tranquila puede aportar claridad a tus vínculos.',
 'Revisá tus compromisos y concentrá tu atención en lo importante.',
 'Dale espacio al descanso y a las pequeñas cosas que disfrutás.',
];
export function dailyHoroscope(dateISO:string,sign:Zodiac) {
 if(!zodiacNames.includes(sign)) throw new Error('Signo no admitido.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) throw new Error('Formato de fecha inválido.');
 const date=new Date(`${dateISO}T12:00:00.000Z`);
 if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==dateISO) throw new Error('Fecha inválida.');
 const positions=planetPositions(date);
 const sun=positions.find(p=>p.name==='Sol')!;
 const moon=positions.find(p=>p.name==='Luna')!;
 const signIndex=zodiacNames.indexOf(sign);
 const seed=Math.floor(norm(moon.longitude))+signIndex*11+Number(dateISO.replace(/-/g,''));
 return {date:dateISO,sign,sunSign:sun.sign,moonSign:moon.sign,
  text:`El Sol transita ${sun.sign} y la Luna ${moon.sign}. ${subjects[seed%subjects.length]} Esta es una reflexión simbólica, no una predicción comprobable.`,
  source:'Posiciones astronómicas geocéntricas calculadas a las 12:00 UTC'};
}
