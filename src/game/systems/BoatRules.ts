export type Dock={boatX:number;boatY:number;landX:number;landY:number;radius:number};
const distance=(ax:number,ay:number,bx:number,by:number)=>Math.hypot(ax-bx,ay-by);
export const canBoard=(player:{x:number;y:number;terrain:string},boat:{x:number;y:number},dock:Dock)=>player.terrain==='jetty'&&distance(player.x,player.y,boat.x,boat.y)<220&&distance(boat.x,boat.y,dock.boatX,dock.boatY)<=dock.radius;
export const canDisembark=(boat:{x:number;y:number},dock:Dock)=>distance(boat.x,boat.y,dock.boatX,dock.boatY)<=dock.radius;
export const continuousBoatVelocity=(input:{x:number;y:number;moving:boolean},speed:number,navigable:boolean)=>input.moving&&navigable?{x:input.x*speed,y:input.y*speed}:{x:0,y:0};
