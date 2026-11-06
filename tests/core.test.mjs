import test from 'node:test';
import assert from 'node:assert/strict';
import {fullDeck,drawCards,spreads} from '../src/lib/tarot.ts';
import {lifePath,expressionNumber,soulNumber,personalityNumber,personalYear,isValidBirthDate} from '../src/lib/numerology.ts';
test('el mazo contiene exactamente 78 cartas distintas',()=>{
 assert.equal(fullDeck.length,78);
 assert.equal(new Set(fullDeck.map(x=>x.number)).size,78);
});
test('tiradas válidas, sin repetición y con inversión booleana',()=>{
 for(const key of Object.keys(spreads)){
  const drawn=drawCards(spreads[key].count);
  assert.equal(drawn.length,spreads[key].count);
  assert.equal(new Set(drawn.map(x=>x.number)).size,drawn.length);
  assert.ok(drawn.every(x=>typeof x.reversed==='boolean'));
 }
 assert.throws(()=>drawCards(0),RangeError);
 assert.throws(()=>drawCards(79),RangeError);
});
test('validación robusta de fechas',()=>{
 assert.equal(isValidBirthDate('2000-02-29'),true);
 assert.equal(isValidBirthDate('2001-02-29'),false);
 assert.equal(isValidBirthDate('2025-13-01'),false);
 assert.equal(isValidBirthDate('no'),false);
 assert.equal(lifePath('2001-02-29'),null);
});
test('cálculos numerológicos deterministas y acentos',()=>{
 assert.equal(lifePath('1990-01-01'),3);
 assert.equal(expressionNumber('Ana'),expressionNumber('Ána'));
 assert.ok(soulNumber('Ana')!==null);
 assert.ok(personalityNumber('Ana')!==null);
 assert.equal(personalYear('1990-01-01',2026),3);
});
import {resolveBirthTime} from '../src/lib/birth-time.ts';
test('Argentina 1990: conversión horaria local a UTC sin inventar carta natal',()=>{
 const result=resolveBirthTime('1990-07-15','12:30','America/Argentina/Buenos_Aires');
 assert.equal(result.ok,true);
 if(result.ok){assert.equal(result.utcISO,'1990-07-15T15:30:00.000Z');assert.equal(result.offsetMinutes,-180)}
});
test('horarios ambiguos e inexistentes durante transición DST en Nueva York',()=>{
 const gap=resolveBirthTime('2024-03-10','02:30','America/New_York');
 const fold=resolveBirthTime('2024-11-03','01:30','America/New_York');
 assert.deepEqual(gap,{ok:false,reason:'nonexistent'});
 assert.deepEqual(fold,{ok:false,reason:'ambiguous'});
});
test('validación zona y fecha',()=>{
 assert.deepEqual(resolveBirthTime('2001-02-29','12:00','UTC'),{ok:false,reason:'date'});
 assert.deepEqual(resolveBirthTime('2000-01-01','27:00','UTC'),{ok:false,reason:'time'});
 assert.deepEqual(resolveBirthTime('2000-01-01','12:00','Zona/Inventada'),{ok:false,reason:'zone'});
});
