import {describe,expect,it} from 'vitest';
import map from '../src/game/data/otuCreekMap.json';
import {TerrainSystem,type TerrainZone} from '../src/game/systems/TerrainSystem';
import {NpcRoutine,facingFromVector} from '../src/game/npc/NpcRoutine';
const terrain=new TerrainSystem(map.terrain as TerrainZone[]);
describe('NPC routines',()=>{
 it('rejects a route through deep water',()=>expect(()=>new NpcRoutine([{x:100,y:500}],50,0,terrain)).toThrow());
 it('moves independently toward a walkable waypoint',()=>{const routine=new NpcRoutine([{x:500,y:500},{x:650,y:500}],60,.4,terrain);const move=routine.step({x:520,y:500},1000);expect(move.moving).toBe(true);expect(move.x).toBeLessThan(0)});
 it('pauses for dialogue and resumes navigation',()=>{const routine=new NpcRoutine([{x:500,y:500},{x:650,y:500}],60,.4,terrain);routine.pauseForTalk();expect(routine.step({x:520,y:500},100).moving).toBe(false);routine.resume();routine.step({x:520,y:500},500);expect(routine.state).not.toBe('talk')});
 it('maps all four diagonal facings',()=>{expect(facingFromVector(-1,-1)).toBe('up-left');expect(facingFromVector(1,-1)).toBe('up-right');expect(facingFromVector(-1,1)).toBe('down-left');expect(facingFromVector(1,1)).toBe('down-right')});
 it('treats placed building footprints as non-walkable',()=>{expect(terrain.at(760,780)).toBe('obstacle');expect(terrain.canWalk(760,780)).toBe(false)});
 it('keeps every core routine segment on walkable terrain',()=>{const routes=[[{x:485,y:690},{x:430,y:715},{x:475,y:735}],[{x:780,y:845},{x:900,y:870},{x:835,y:930}],[{x:1450,y:800},{x:1280,y:900},{x:1080,y:920}]];for(const route of routes)for(let i=0;i<route.length;i++){const a=route[i],b=route[(i+1)%route.length];for(let t=0;t<=1;t+=.05)expect(terrain.canWalk(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t)).toBe(true)}});
});
