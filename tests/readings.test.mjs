import test from 'node:test';
import assert from 'node:assert/strict';
import { validateReading, saveReading, listReadings, removeReading, exportReadings } from '../src/lib/readings.ts';

function queryMock(reply, log) {
  const q = {
    select(...v){log.push(['select',...v]);return q},
    insert(...v){log.push(['insert',...v]);return q},
    delete(){log.push(['delete']);return q},
    eq(...v){log.push(['eq',...v]);return q},
    order(...v){log.push(['order',...v]);return q},
    limit(n){log.push(['limit',n]);return Promise.resolve(reply)},
    range(...v){log.push(['range',...v]);return Promise.resolve(reply)},
    single(){log.push(['single']);return Promise.resolve(reply)},
    then(resolve, reject){return Promise.resolve(reply).then(resolve,reject)},
  };
  return { from(name){log.push(['from',name]);return q} };
}
const example = { kind: 'tarot', title: 'Tres cartas', payload: {cards: [1,2,3]} };
test('validación de tipo, título y tamaño del guardado', () => {
  assert.doesNotThrow(()=>validateReading(example));
  assert.throws(()=>validateReading({...example,kind:'other'}));
  assert.throws(()=>validateReading({...example,title:''}));
  assert.throws(()=>validateReading({...example,payload:{huge:'é'.repeat(7000)}}));
});
test('guardado utiliza user_id y retorna fila propia', async () => {
  const log=[]; const row={id:'r1',user_id:'u1',...example};
  const saved=await saveReading(queryMock({data:row,error:null},log),'u1',example);
  assert.equal(saved.id,'r1');
  assert.deepEqual(log.find(x=>x[0]==='insert')[1].user_id,'u1');
  await assert.rejects(()=>saveReading(queryMock({data:{...row,user_id:'u2'},error:null},[]),'u1',example));
});
test('historial exige filtro propio, límite y orden', async()=>{
  const log=[];
  await listReadings(queryMock({data:[],error:null},log),'u1');
  assert.ok(log.some(x=>x[0]==='eq'&&x[1]==='user_id'&&x[2]==='u1'));
  assert.ok(log.some(x=>x[0]==='limit'&&x[1]===30));
});
test('borrado exige id y user_id; falla si ninguna fila fue borrada', async()=>{
  const log=[];
  await removeReading(queryMock({data:[{id:'r1'}],error:null},log),'u1','r1');
  assert.ok(log.some(x=>x[0]==='eq'&&x[1]==='user_id'&&x[2]==='u1'));
  await assert.rejects(()=>removeReading(queryMock({data:[],error:null},[]),'u1','r1'));
});
test('exportación usa paginación y filtro de usuario',async()=>{
  const log=[];const rows=await exportReadings(queryMock({data:[{id:'r1'}],error:null},log),'u1');
  assert.equal(rows.length,1);
  assert.ok(log.some(x=>x[0]==='range'&&x[1]===0&&x[2]===499));
  assert.ok(log.some(x=>x[0]==='eq'&&x[1]==='user_id'&&x[2]==='u1'));
});
