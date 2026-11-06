import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const files = [
  'src/app/layout.tsx', 'src/app/manifest.ts', 'src/app/page.tsx',
  'docs/DEPLOY-SEGURO.md', 'docs/SUPABASE-CUENTAS.md', 'docs/INTEGRACION-RICHCOINAR.md'
];
for (const filename of files) {
  const content = readFileSync(filename, 'utf8');
  assert.ok(!content.includes('astro.publicalogratis.store'), `${filename} contiene dominio anterior`);
  assert.ok(!content.includes('richcoinar/astro-pwa'), `${filename} contiene repo anterior`);
}
assert.ok(readFileSync('src/app/layout.tsx','utf8').includes('astrolunia.publicalogratis.store'));
assert.ok(readFileSync('src/app/manifest.ts','utf8').includes('Astrolunia'));
assert.ok(readFileSync('.env.example','utf8').includes('https://bdhwkvlpnixfamsvjfco.supabase.co'));
console.log('Marca, subdominio, repositorio y Supabase coherentes.');
