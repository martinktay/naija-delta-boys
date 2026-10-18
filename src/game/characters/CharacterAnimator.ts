import * as Phaser from 'phaser';

export type CharacterAnimState='idle'|'walk'|'turn'|'interact'|'talk'|'swim'|'boat';
export type Facing='up-left'|'up-right'|'down-left'|'down-right';
export type CharacterPalette={skin:number;shirt:number;trousers:number;accent:number;hair:number};

class Limb{
 readonly root:Phaser.GameObjects.Container;private lower:Phaser.GameObjects.Rectangle;private end:Phaser.GameObjects.Ellipse;private readonly restY:number;
 constructor(scene:Phaser.Scene,x:number,y:number,color:number,upperLength:number,lowerLength:number,width:number,endColor=color){
  this.restY=y;this.root=scene.add.container(x,y);const upper=scene.add.rectangle(0,upperLength/2,width,upperLength,color).setOrigin(.5,.5);
  const joint=scene.add.circle(0,upperLength,Math.max(2,width*.42),color);this.lower=scene.add.rectangle(0,upperLength+lowerLength/2,width*.9,lowerLength,color).setOrigin(.5,.5);
  this.end=scene.add.ellipse(0,upperLength+lowerLength+2,width*1.45,5,endColor).setOrigin(.5,.5);this.root.add([upper,joint,this.lower,this.end]);
 }
 pose(upper:number,lower:number,stretch=0){this.root.rotation=upper;this.lower.rotation=lower;this.end.rotation=-upper-lower*.35;this.root.y=this.restY+stretch}
}

export class CharacterAnimator{
 readonly root:Phaser.GameObjects.Container;readonly palette:CharacterPalette;state:CharacterAnimState='idle';facing:Facing='down-right';
 private leftArm:Limb;private rightArm:Limb;private leftLeg:Limb;private rightLeg:Limb;private torso:Phaser.GameObjects.Rectangle;private head:Phaser.GameObjects.Arc;private face:Phaser.GameObjects.Arc;private phase:number;private elapsed=0;private baseY=0;
 constructor(scene:Phaser.Scene,palette:CharacterPalette,phaseOffset=0,scale=1){
  this.palette=palette;this.phase=phaseOffset;this.root=scene.add.container(0,0).setScale(scale);
  const shadow=scene.add.ellipse(0,0,31,10,0x092824,.28).setOrigin(.5,.5);
  this.leftLeg=new Limb(scene,-6,-35,palette.trousers,19,17,7,palette.accent);this.rightLeg=new Limb(scene,6,-35,palette.trousers,19,17,7,palette.accent);
  this.leftArm=new Limb(scene,-12,-62,palette.skin,17,15,6,palette.skin);this.rightArm=new Limb(scene,12,-62,palette.skin,17,15,6,palette.skin);
  this.torso=scene.add.rectangle(0,-58,25,32,palette.shirt).setOrigin(.5,.5).setStrokeStyle(2,palette.accent,.65);
  const neck=scene.add.rectangle(0,-79,7,7,palette.skin);this.head=scene.add.circle(0,-91,12,palette.skin).setStrokeStyle(2,palette.hair,.9);const hair=scene.add.ellipse(0,-99,22,10,palette.hair);this.face=scene.add.circle(5,-90,2,0x1d1612);
  this.root.add([shadow,this.leftLeg.root,this.rightLeg.root,this.leftArm.root,this.torso,neck,this.head,hair,this.face,this.rightArm.root]);this.setFacing('down-right');
 }
 setPosition(x:number,y:number){this.root.setPosition(x,y);this.baseY=y;return this}
 setDepth(depth:number){this.root.setDepth(depth);return this}
 setVisible(value:boolean){this.root.setVisible(value);return this}
 setAlpha(value:number){this.root.setAlpha(value);return this}
 setState(state:CharacterAnimState){if(this.state!==state){this.state=state;if(state==='idle')this.elapsed=0}return this}
 setFacing(facing:Facing){this.facing=facing;const right=facing.endsWith('right');const up=facing.startsWith('up');this.root.scaleX=Math.abs(this.root.scaleX)*(right?1:-1);this.torso.setFillStyle(up?Phaser.Display.Color.ValueToColor(this.palette.shirt).darken(18).color:this.palette.shirt);this.face.setPosition(5,up?-94:-90);return this}
 update(delta:number,speed=1){
  this.elapsed+=delta;const walking=this.state==='walk';const swimming=this.state==='swim';const talking=this.state==='talk';const rate=walking?Math.max(.7,speed)*.009:swimming?.006:.0025;this.phase+=delta*rate;
  const stride=(walking||swimming)?Math.sin(this.phase):0;const pass=(walking||swimming)?Math.sin(this.phase*2):0;const arm=(swimming?.92:.62)*stride,leg=(swimming?.32:.52)*stride;
  this.leftArm.pose(arm,-Math.max(0,-stride)*.45);this.rightArm.pose(-arm,-Math.max(0,stride)*.45);
  this.leftLeg.pose(-leg,Math.max(0,stride)*.62,0);this.rightLeg.pose(leg,Math.max(0,-stride)*.62,0);
  if(talking){this.rightArm.pose(-.75+Math.sin(this.phase)*.18,-.55);this.leftArm.pose(.15,0)}
  const bob=walking?Math.abs(pass)*1.8:swimming?Math.sin(this.phase*2)*1.2:Math.sin(this.phase)*.55;this.root.y=this.baseY-bob;this.torso.rotation=walking?-stride*.025:swimming?stride*.08:0;this.head.rotation=(walking||swimming)?stride*.035:talking?Math.sin(this.phase)*.035:0;
 }
 destroy(){this.root.destroy(true)}
}

export const characterPalettes={
 player:{skin:0x8d4b2e,shirt:0x247052,trousers:0x263340,accent:0xf3eee4,hair:0x171412},
 timi:{skin:0x704028,shirt:0xf4eee2,trousers:0x286489,accent:0xe9b83f,hair:0x29211a},
 tari:{skin:0x8b4c2e,shirt:0xe1a72b,trousers:0x265d85,accent:0xd94736,hair:0x1b1715},
 representative:{skin:0x71412e,shirt:0xe8dfc9,trousers:0x5a4031,accent:0x1f4f72,hair:0x171412}
} satisfies Record<string,CharacterPalette>;
