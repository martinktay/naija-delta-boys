import {type Facing} from '../characters/CharacterAnimator';
import {TerrainSystem} from '../systems/TerrainSystem';
export type Point={x:number;y:number};export type NpcRoutineState='idle'|'navigate'|'work'|'talk';
export const facingFromVector=(x:number,y:number):Facing=>y<0?(x<0?'up-left':'up-right'):(x<0?'down-left':'down-right');
export class NpcRoutine{
 state:NpcRoutineState='idle';index=0;wait=0;pausedState:NpcRoutineState='navigate';
 constructor(readonly waypoints:Point[],readonly speed:number,readonly phaseOffset:number,private terrain:TerrainSystem){if(!waypoints.every(p=>terrain.canWalk(p.x,p.y)))throw new Error('NPC waypoint is not walkable')}
 target(){return this.waypoints[this.index]}
 pauseForTalk(){this.pausedState=this.state==='talk'?'navigate':this.state;this.state='talk'}
 resume(){this.state=this.pausedState==='talk'?'navigate':this.pausedState;this.wait=450}
 step(position:Point,delta:number){
  if(this.state==='talk')return{x:0,y:0,moving:false,facing:null as Facing|null};
  if(this.wait>0){this.wait-=delta;this.state='idle';return{x:0,y:0,moving:false,facing:null as Facing|null}}
  this.state='navigate';const t=this.target(),dx=t.x-position.x,dy=t.y-position.y,d=Math.hypot(dx,dy);
  if(d<5){this.index=(this.index+1)%this.waypoints.length;this.wait=900+this.phaseOffset*110;this.state='work';return{x:0,y:0,moving:false,facing:null as Facing|null}}
  const amount=Math.min(d,this.speed*delta/1000),x=dx/d*amount,y=dy/d*amount;const nx=position.x+x,ny=position.y+y;if(!this.terrain.canWalk(nx,ny)){this.index=(this.index+1)%this.waypoints.length;this.wait=600;return{x:0,y:0,moving:false,facing:null as Facing|null}}
  return{x,y,moving:true,facing:facingFromVector(dx,dy)};
 }
}
