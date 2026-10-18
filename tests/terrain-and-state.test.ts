import {describe,expect,it} from 'vitest';
import map from '../src/game/data/otuCreekMap.json';
import {TerrainSystem,type TerrainZone} from '../src/game/systems/TerrainSystem';
import {GameplayState,PlayerMode} from '../src/game/systems/GameplayState';
import {canBoard,canDisembark} from '../src/game/systems/BoatRules';

const terrain=new TerrainSystem(map.terrain as TerrainZone[]);
describe('Otu Creek terrain',()=>{
 it('blocks on-foot travel into deep water',()=>expect(terrain.canWalk(100,600)).toBe(false));
 it('allows walking on a jetty over water',()=>expect(terrain.canWalk(300,700)).toBe(true));
 it('allows boats only on water',()=>{expect(terrain.canBoat(200,600)).toBe(true);expect(terrain.canBoat(900,600)).toBe(false)});
 it('recognises valid swim water and shore exit',()=>{expect(terrain.canSwim(200,600)).toBe(true);expect(terrain.canSwim(500,600)).toBe(false)});
});
describe('authoritative player state',()=>{
 it('supports boarding, driving and disembarking',()=>{const s=new GameplayState();s.transition(PlayerMode.Boarding);s.transition(PlayerMode.BoatDriver);s.transition(PlayerMode.OnFoot);expect(s.mode).toBe(PlayerMode.OnFoot)});
 it('supports swimming, drowning and respawn',()=>{const s=new GameplayState();s.transition(PlayerMode.Swimming);s.transition(PlayerMode.Drowning);s.transition(PlayerMode.Respawning);s.transition(PlayerMode.OnFoot);expect(s.mode).toBe(PlayerMode.OnFoot)});
 it('rejects impossible remote transitions',()=>{const s=new GameplayState();expect(()=>s.transition(PlayerMode.BoatDriver)).toThrow()});
});
describe('boat interaction rules',()=>{
 const dock=map.docks[0];
 it('boards only from the authorised jetty range',()=>{expect(canBoard({x:390,y:730,terrain:'jetty'},{x:dock.boatX,y:dock.boatY},dock)).toBe(true);expect(canBoard({x:390,y:730,terrain:'deepWater'},{x:dock.boatX,y:dock.boatY},dock)).toBe(false)});
 it('blocks remote boarding and disembarking',()=>{expect(canBoard({x:900,y:730,terrain:'land'},{x:dock.boatX,y:dock.boatY},dock)).toBe(false);expect(canDisembark({x:100,y:100},dock)).toBe(false)});
 it('allows disembarking at a dock',()=>expect(canDisembark({x:dock.boatX,y:dock.boatY},dock)).toBe(true));
});
