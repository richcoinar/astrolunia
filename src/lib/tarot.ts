/** Lecturas simbólicas. Las cartas no predicen acontecimientos. */
export type TarotCard = {number:number; title:string; meaning:string; reversed:boolean; suit?:string};
export const majorArcana = [
 ['El Loco','Nuevos comienzos, libertad y confianza en el camino.'],['El Mago','Iniciativa, recursos y acción consciente.'],['La Sacerdotisa','Intuición, silencio y sabiduría interior.'],['La Emperatriz','Creatividad, nutrición y crecimiento.'],['El Emperador','Estructura, autoridad y límites.'],['El Hierofante','Aprendizaje, tradición y comunidad.'],['Los Enamorados','Valores, elecciones y relaciones.'],['El Carro','Dirección, voluntad y avance.'],['La Fuerza','Paciencia, coraje y dominio interior.'],['El Ermitaño','Introspección, búsqueda y calma.'],['La Rueda de la Fortuna','Ciclos, cambio y oportunidad.'],['La Justicia','Equilibrio, honestidad y consecuencias.'],['El Colgado','Pausa, perspectiva y entrega.'],['La Muerte','Transformación, cierre y renovación.'],['La Templanza','Integración, moderación y armonía.'],['El Diablo','Apegos, tentaciones y patrones.'],['La Torre','Ruptura, revelación y reconstrucción.'],['La Estrella','Esperanza, autenticidad y recuperación.'],['La Luna','Sueños, emociones e incertidumbre.'],['El Sol','Claridad, vitalidad y alegría.'],['El Juicio','Despertar, revisión y llamado interior.'],['El Mundo','Integración, realización y culminación.']
] as const;
const suits = [
 {name:'Bastos',focus:'iniciativa, creatividad y energía',symbol:'♧'},
 {name:'Copas',focus:'emociones, vínculos y sensibilidad',symbol:'♡'},
 {name:'Espadas',focus:'ideas, comunicación y decisiones',symbol:'♢'},
 {name:'Oros',focus:'recursos, trabajo y vida práctica',symbol:'✧'}
] as const;
const ranks = [
 ['As','una oportunidad o un inicio'],['Dos','una elección y la búsqueda de equilibrio'],['Tres','la colaboración y el crecimiento'],
 ['Cuatro','la estabilidad y la necesidad de revisar estructuras'],['Cinco','un desafío o una tensión'],
 ['Seis','la cooperación y una transición'],['Siete','la reflexión y la evaluación'],
 ['Ocho','el esfuerzo y la perseverancia'],['Nueve','la maduración de un proceso'],
 ['Diez','el cierre de un ciclo'],['Sota','la curiosidad y el aprendizaje'],['Caballero','el movimiento y la búsqueda'],
 ['Reina','la comprensión y la expresión madura'],['Rey','la responsabilidad y el liderazgo']
] as const;
export const fullDeck: Omit<TarotCard,'reversed'>[] = [
 ...majorArcana.map(([title,meaning],number)=>({number,title,meaning})),
 ...suits.flatMap((suit,suitIndex)=>ranks.map(([rank,reading],rankIndex)=>({
  number:22+suitIndex*14+rankIndex,title:`${rank} de ${suit.name}`,suit:suit.name,
  meaning:`${reading[0].toUpperCase()+reading.slice(1)} en temas de ${suit.focus}.`
 })))
];
export const spreads = {
  one: {name:'Una carta',labels:['Reflexión del momento'],count:1},
  three: {name:'Tres cartas',labels:['Pasado simbólico','Presente','Posibilidad'],count:3},
  five: {name:'Cinco cartas',labels:['Situación','Desafío','Recursos','Aprendizaje','Posibilidad'],count:5}
} as const;
export type SpreadKey=keyof typeof spreads;
/** Barajado Fisher-Yates con aleatoriedad del navegador cuando esté disponible. */
export function drawCards(count=3,random:()=>number=Math.random):TarotCard[]{
 if(!Number.isInteger(count)||count<1||count>fullDeck.length)throw new RangeError('Cantidad inválida de cartas');
 const arr=[...fullDeck];
 for(let i=arr.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
 return arr.slice(0,count).map(card=>({...card,reversed:random()<.35}));
}
export function cryptoRandom(){
 if(typeof crypto==='undefined'||!crypto.getRandomValues)return Math.random();
 const n=new Uint32Array(1);crypto.getRandomValues(n);return n[0]/4294967296;
}
