export type TerrainType='land'|'path'|'jetty'|'shallowWater'|'deepWater'|'obstacle';
export type TerrainZone={id:string;type:TerrainType;x:number;y:number;width:number;height:number};
export type Road={id:string;width:number;points:number[][]};
export function onRoad(x:number,y:number,road:Road,clearance=0){
 return road.points.slice(1).some((b,i)=>{
  const a=road.points[i],dx=b[0]-a[0],dy=b[1]-a[1],length=dx*dx+dy*dy;
  const t=length?Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/length)):0;
  return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)<=road.width/2-clearance;
 });
}
const priority:TerrainType[]=['obstacle','jetty','path','land','shallowWater','deepWater'];
export class TerrainSystem{
 constructor(private zones:TerrainZone[],private roads:Road[]=[]){}
 at(x:number,y:number):TerrainType{
  const hits=this.zones.filter(z=>x>=z.x&&y>=z.y&&x<=z.x+z.width&&y<=z.y+z.height);
  const base=hits.sort((a,b)=>priority.indexOf(a.type)-priority.indexOf(b.type))[0]?.type??'obstacle';
  // Roads never turn water or buildings into walkable surfaces. Bridges need a jetty zone.
  return base==='land'&&this.roads.some(road=>onRoad(x,y,road))?'path':base;
 }
 canWalk(x:number,y:number){return ['land','path','jetty'].includes(this.at(x,y))}
 canBoat(x:number,y:number){return ['deepWater','shallowWater'].includes(this.at(x,y))}
 canSwim(x:number,y:number){return ['deepWater','shallowWater'].includes(this.at(x,y))}
}
