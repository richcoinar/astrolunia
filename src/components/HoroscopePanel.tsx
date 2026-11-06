'use client';
import {useMemo,useState} from 'react';
import {dailyHoroscope} from '@/lib/horoscope';
import {zodiacNames,type Zodiac} from '@/lib/astrology';
export default function HoroscopePanel(){
 const [sign,setSign]=useState<Zodiac>('Aries');
 const today=new Date().toISOString().slice(0,10);
 const prediction=useMemo(()=>dailyHoroscope(today,sign),[today,sign]);
 return <section className="section container" id="horoscopo"><div className="section-heading"><span className="kicker">HORÓSCOPO DIARIO</span><h2>Reflexiones <em>del día.</em></h2><p>El Sol y la Luna se calculan con efemérides reales. El texto es una interpretación simbólica, no un pronóstico comprobable.</p></div><div className="num-form"><label htmlFor="h-sign">Elegí tu signo</label><select id="h-sign" value={sign} onChange={e=>setSign(e.target.value as Zodiac)}>{zodiacNames.map(s=><option key={s}>{s}</option>)}</select><h3>{prediction.sign} · {prediction.date}</h3><p>{prediction.text}</p><small>{prediction.source}. Fecha UTC; el día local puede variar según tu ubicación.</small></div></section>;
}
