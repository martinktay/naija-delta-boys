import * as Phaser from 'phaser';
import type {CharacterAnimState,Facing} from './CharacterAnimator';
import {WalkCycleModel} from './WalkCycleModel';

type AtlasRows=Record<Facing,number>;

export class AtlasCharacterAnimator{
 readonly root:Phaser.GameObjects.Container;
 private readonly sprite:Phaser.GameObjects.Sprite;
 private readonly cycle:WalkCycleModel;
 private baseY=0;
 private elapsed=0;

 constructor(scene:Phaser.Scene,texture:string,scale=.43,phaseOffset=0,private readonly rows?:AtlasRows,footpoint={x:.5,y:.94}){
  this.root=scene.add.container(0,0).setScale(scale);
  this.sprite=scene.add.sprite(0,0,texture,24).setOrigin(footpoint.x,footpoint.y);
  this.root.add(this.sprite);
  this.cycle=new WalkCycleModel(phaseOffset,100);
 }

 setPosition(x:number,y:number){this.root.setPosition(x,y);this.baseY=y;return this}
 setDepth(depth:number){this.root.setDepth(depth);return this}
 setVisible(value:boolean){this.root.setVisible(value);return this}
 setAlpha(value:number){this.root.setAlpha(value);return this}
 setFacing(facing:Facing){
  this.cycle.setFacing(facing);this.sprite.setFrame(this.frame);
  return this;
 }
 setState(state:CharacterAnimState){
  this.cycle.setState(state);this.sprite.setFrame(this.frame);
  return this;
 }
 update(delta:number,_speed=1){
  this.elapsed+=delta;
  this.cycle.update(delta);this.sprite.setFrame(this.frame);
  const swimming=this.cycle.state==='swim';
  this.root.y=this.baseY+(swimming?Math.sin(this.elapsed*.008)*2:0);
  this.sprite.rotation=swimming?Math.sin(this.elapsed*.006)*.05:0;
 }
 private get frame(){return (this.rows?.[this.cycle.facing]??Math.floor(this.cycle.frame/8))*8+this.cycle.frame%8}
 destroy(){this.root.destroy(true)}
}

