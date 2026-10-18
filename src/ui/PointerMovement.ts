export type MoveDirection='up'|'down'|'left'|'right';

export class PointerMovement{
 private activePointer:number|null=null;
 private direction:MoveDirection|null=null;
 constructor(private startMove:(direction:MoveDirection)=>void,private stopMove:()=>void){}
 start(pointerId:number,direction:MoveDirection){
  if(this.activePointer!==null&&this.activePointer!==pointerId)return false;
  this.activePointer=pointerId;this.setDirection(direction);return true;
 }
 move(pointerId:number,direction:MoveDirection|null){
  if(pointerId!==this.activePointer)return false;
  if(direction)this.setDirection(direction);else this.release(pointerId);
  return true;
 }
 release(pointerId?:number){
  if(this.activePointer===null||(pointerId!==undefined&&pointerId!==this.activePointer))return false;
  this.activePointer=null;this.direction=null;this.stopMove();return true;
 }
 cancel(){return this.release()}
 get active(){return this.activePointer!==null}
 private setDirection(direction:MoveDirection){if(direction!==this.direction){this.direction=direction;this.startMove(direction)}}
}

