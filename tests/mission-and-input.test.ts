import {describe,expect,it} from 'vitest';
import {applyDrowningPenalty,applyMissionChoice,restoreMission,serializeMission} from '../src/game/systems/MissionProgress';
import {continuousBoatVelocity} from '../src/game/systems/BoatRules';

describe('mission persistence and reward integrity',()=>{
 it('completes the parcel mission and pays exactly once',()=>{let state={stage:'meet-timi' as const,money:2500};state=applyMissionChoice(state,'accept');state=applyMissionChoice(state,'delivered');state=applyMissionChoice(state,'reward');expect(state).toEqual({stage:'complete',money:4000});expect(applyMissionChoice(state,'reward')).toEqual(state)});
 it('round-trips saved progress and tolerates broken storage',()=>{const state={stage:'return' as const,money:2500};expect(restoreMission(serializeMission(state),{stage:'meet-timi',money:0})).toEqual(state);expect(restoreMission('{bad',{stage:'meet-timi',money:2500})).toEqual({stage:'meet-timi',money:2500})});
 it('applies the drowning cost and life loss without negative values',()=>{expect(applyDrowningPenalty(4000,3,250)).toEqual({money:3750,lives:2});expect(applyDrowningPenalty(100,0,250)).toEqual({money:0,lives:0})});
});

describe('continuous boat steering',()=>{
 it('returns continuous velocity while held in navigable water',()=>expect(continuousBoatVelocity({x:1,y:0,moving:true},155,true)).toEqual({x:155,y:0}));
 it('stops immediately on release or non-water terrain',()=>{expect(continuousBoatVelocity({x:1,y:0,moving:false},155,true)).toEqual({x:0,y:0});expect(continuousBoatVelocity({x:1,y:0,moving:true},155,false)).toEqual({x:0,y:0})});
});
