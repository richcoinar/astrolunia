/** Numerología pitagórica simbólica: carece de poder predictivo demostrado. */
const MAP:Record<string,number>={A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
function reduce(value:number){while(value>9 && ![11,22,33].includes(value)){value=String(value).split('').reduce((s,x)=>s+Number(x),0);}return value;}
export function isValidBirthDate(date:string){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return false;
 const [y,m,d]=date.split('-').map(Number);if(y<1||y>9999)return false;
 const parsed=new Date(Date.UTC(y,m-1,d));
 return parsed.getUTCFullYear()===y&&parsed.getUTCMonth()===m-1&&parsed.getUTCDate()===d;
}
export function lifePath(date:string){if(!isValidBirthDate(date))return null;return reduce([...date.replaceAll('-','')].reduce((s,n)=>s+Number(n),0));}
function letters(name:string){return [...name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase()].filter(ch=>ch in MAP);}
export function expressionNumber(name:string){const values=letters(name).map(ch=>MAP[ch]);return values.length?reduce(values.reduce((a,b)=>a+b,0)):null;}
export function soulNumber(name:string){const values=letters(name).filter(ch=>'AEIOU'.includes(ch)).map(ch=>MAP[ch]);return values.length?reduce(values.reduce((a,b)=>a+b,0)):null;}
export function personalityNumber(name:string){const values=letters(name).filter(ch=>!'AEIOU'.includes(ch)).map(ch=>MAP[ch]);return values.length?reduce(values.reduce((a,b)=>a+b,0)):null;}
export function personalYear(date:string,year:number){if(!isValidBirthDate(date)||!Number.isInteger(year)||year<1||year>9999)return null;const [,month,day]=date.split('-').map(Number);return reduce(String(`${month}${day}${year}`).split('').reduce((s,n)=>s+Number(n),0));}
export const interpretations:Record<number,string>={1:'Iniciativa, individualidad y nuevos comienzos.',2:'Cooperación, sensibilidad y vínculos.',3:'Creatividad, expresión y comunicación.',4:'Estructura, constancia y construcción.',5:'Cambio, libertad y exploración.',6:'Armonía, cuidado y responsabilidad.',7:'Búsqueda interior, reflexión y estudio.',8:'Organización, liderazgo y logros.',9:'Compasión, cierres y perspectiva amplia.',11:'Intuición, inspiración e idealismo.',22:'Visión práctica y proyectos de largo alcance.',33:'Servicio, empatía y enseñanza.'};
