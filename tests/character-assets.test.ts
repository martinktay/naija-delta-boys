import {describe,expect,it} from 'vitest';
import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import manifest from '../public/assets/naija-delta-boys/characters/character_animation_manifest.json';

const root=resolve(process.cwd(),'public/assets/naija-delta-boys');
const pngSize=(path:string)=>{const data=readFileSync(path);return{width:data.readUInt32BE(16),height:data.readUInt32BE(20)}};

describe('canonical character asset bundle',()=>{
 it('registers all four active characters as production walk art',()=>{
  expect(manifest.characters.map(c=>c.id)).toEqual(['player','timi','tari','community_representative']);
  expect(manifest.characters.every(c=>c.art_status==='production_walk')).toBe(true);
 });
 it('has every manifest texture and an exact 8 by 4 grid',()=>{
  for(const character of manifest.characters){
   const path=resolve(root,character.texture);expect(existsSync(path),character.texture).toBe(true);
   const size=pngSize(path);expect(size.width).toBe(character.frame_size[0]*8);expect(size.height).toBe(character.frame_size[1]*4);
  }
 });
 it('keeps the canonical visual references available to evidence pages',()=>{
  expect(existsSync(resolve(root,'references/civilian_characters.png'))).toBe(true);
  expect(existsSync(resolve(root,'references/otu_creek_waterfront_composition.png'))).toBe(true);
 });
});
