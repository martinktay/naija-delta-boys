import {describe,expect,it,vi} from 'vitest';
import {PointerMovement} from '../src/ui/PointerMovement';

describe('touch pointer movement',()=>{
 it('starts, changes direction and stops on release',()=>{const start=vi.fn(),stop=vi.fn(),control=new PointerMovement(start,stop);expect(control.start(7,'up')).toBe(true);control.move(7,'right');control.release(7);expect(start.mock.calls).toEqual([['up'],['right']]);expect(stop).toHaveBeenCalledOnce()});
 it('ignores a competing second touch',()=>{const start=vi.fn(),control=new PointerMovement(start,vi.fn());control.start(1,'left');expect(control.start(2,'right')).toBe(false);expect(start).toHaveBeenCalledTimes(1)});
 it('releases on pointer cancel, blur or visibility cleanup',()=>{const stop=vi.fn(),control=new PointerMovement(vi.fn(),stop);control.start(3,'down');expect(control.cancel()).toBe(true);expect(control.active).toBe(false);expect(stop).toHaveBeenCalledOnce()});
 it('stops when the active pointer leaves the allowed direction area',()=>{const stop=vi.fn(),control=new PointerMovement(vi.fn(),stop);control.start(4,'up');control.move(4,null);expect(stop).toHaveBeenCalledOnce()});
});
