import {describe,it,expect} from 'vitest';
import {reconstructionPreview as map,previewRoutines,previewDestinations} from '../src/game/data/reconstructionPreview';
import {TerrainSystem,type TerrainZone,onRoad} from '../src/game/systems/TerrainSystem';
import {NpcRoutine} from '../src/game/npc/NpcRoutine';
const terrain=new TerrainSystem(map.terrain as TerrainZone[],map.roads);
describe('isolated reconstruction map',()=>{
 it('keeps entire roads clear, including their usable width',()=>{
  for(const road of map.roads)for(let i=1;i<road.points.length;i++){
   const a=road.points[i-1],b=road.points[i],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);
   for(let distance=0;distance<=length;distance+=4)for(const offset of [-12,0,12]){
    const x=a[0]+dx*distance/length-dy/length*offset,y=a[1]+dy*distance/length+dx/length*offset;
    expect(terrain.canWalk(x,y),`${road.id}: ${x},${y}`).toBe(true);
   }
  }
 });
 it('connects all destinations with a flood fill on visible paths',()=>{
  const step=10,start=previewDestinations[0],queue=[[start.x,start.y]],seen=new Set([`${start.x},${start.y}`]);
  for(let i=0;i<queue.length;i++){
   const [x,y]=queue[i];
   for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){
    const nx=x+dx,ny=y+dy,key=`${nx},${ny}`;
    if(nx<0||ny<0||nx>1900||ny>1250||seen.has(key))continue;
    if(!['path','jetty'].includes(terrain.at(nx,ny)))continue;
    seen.add(key);queue.push([nx,ny]);
   }
  }
  for(const target of previewDestinations)expect(queue.some(([x,y])=>Math.hypot(x-target.x,y-target.y)<15),target.id).toBe(true);
 });
 it('simulates each actual patrol for two minutes, including wraparound',()=>{
  for(const route of Object.values(previewRoutines)){
   const points=route.map(([x,y])=>({x,y})),routine=new NpcRoutine(points,42,0,terrain),position={...points[0]};
   const visited=new Set<number>();
   for(let tick=0;tick<7200;tick++){
    const movement=routine.step(position,1000/60);position.x+=movement.x;position.y+=movement.y;
    expect(terrain.canWalk(position.x,position.y)).toBe(true);
    expect(map.roads.some(road=>onRoad(position.x,position.y,road))||terrain.at(position.x,position.y)==='jetty').toBe(true);
    visited.add(routine.index);
   }
   expect(visited.size).toBe(points.length);
  }
 });
 it('does not create a walkable road across water',()=>{
  expect(new TerrainSystem([{id:'water',type:'deepWater',x:0,y:0,width:100,height:100}],[{id:'bad-road',width:50,points:[[0,50],[100,50]]}]).canWalk(50,50)).toBe(false);
 });
});
