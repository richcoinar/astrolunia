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
