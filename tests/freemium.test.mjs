import test from 'node:test';
import assert from 'node:assert/strict';
import {effectivePlan,isAdmin,planLimits} from '../src/lib/entitlements.ts';
import {validateChart} from '../src/lib/charts.ts';
test('el plan premium vencido vuelve a free',()=>{
 assert.equal(effectivePlan('premium','2024-01-01T00:00:00Z',new Date('2026-11-01T00:00:00Z')),'free');
 assert.equal(effectivePlan('premium','2027-01-01T00:00:00Z',new Date('2026-11-01T00:00:00Z')),'premium');
 assert.equal(effectivePlan(undefined,undefined),'free');
});
test('los permisos administrativos solo provienen de metadatos privilegiados',()=>{
 assert.equal(isAdmin({astrolunia_role:'admin'}),true);
 assert.equal(isAdmin({role:'admin'}),false);
 assert.equal(isAdmin(undefined),false);
});
test('límites Freemium definidos en servidor',()=>{
 assert.equal(planLimits.free.aiPerMonth,3);
 assert.equal(planLimits.premium.aiPerMonth,100);
});
test('se rechazan cartas inválidas antes de persistencia',()=>{
 assert.throws(()=>validateChart('',{}),/Título/);
 assert.throws(()=>validateChart('Mi carta',{positions:[],ascendant:45}),/inválida/);
});
