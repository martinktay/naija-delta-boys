export type TerrainType='land'|'path'|'jetty'|'shallowWater'|'deepWater'|'obstacle';
export type TerrainZone={id:string;type:TerrainType;x:number;y:number;width:number;height:number};
const priority:TerrainType[]=['obstacle','jetty','path','land','shallowWater','deepWater'];
export class TerrainSystem{
 constructor(private zones:TerrainZone[]){}
 at(x:number,y:number):TerrainType{const hits=this.zones.filter(z=>x>=z.x&&y>=z.y&&x<=z.x+z.width&&y<=z.y+z.height);return hits.sort((a,b)=>priority.indexOf(a.type)-priority.indexOf(b.type))[0]?.type??'obstacle'}
 canWalk(x:number,y:number){return ['land','path','jetty'].includes(this.at(x,y))}
 canBoat(x:number,y:number){return ['deepWater','shallowWater'].includes(this.at(x,y))}
 canSwim(x:number,y:number){return ['deepWater','shallowWater'].includes(this.at(x,y))}
}
