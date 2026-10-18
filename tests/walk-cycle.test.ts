import {describe,expect,it} from 'vitest';
import {WalkCycleModel} from '../src/game/characters/WalkCycleModel';

describe('production walk-cycle model',()=>{
 it('stays on an idle frame while stationary',()=>{const cycle=new WalkCycleModel();cycle.update(800);expect(cycle.frame).toBe(0)});
 it('advances through eight distinct frames at 10 fps',()=>{const cycle=new WalkCycleModel();cycle.setState('walk');const frames=new Set<number>();for(let i=0;i<8;i++){frames.add(cycle.frame);cycle.update(100)}expect(frames.size).toBe(8)});
 it('maps four facings to separate calibrated atlas rows',()=>{const cycle=new WalkCycleModel();const rows={"up-left":3,"up-right":2,"down-left":1,"down-right":0} as const;Object.entries(rows).forEach(([facing,row])=>{cycle.setFacing(facing as keyof typeof rows);expect(cycle.frame).toBe(row*8)})});
 it('keeps character clocks independent',()=>{const first=new WalkCycleModel(0),second=new WalkCycleModel(350);first.setState('walk');second.setState('walk');first.update(100);second.update(100);expect(first.frame).not.toBe(second.frame)});
 it('stops animation immediately when movement stops',()=>{const cycle=new WalkCycleModel();cycle.setState('walk');cycle.update(450);cycle.setState('idle');expect(cycle.frame).toBe(0)});
});
