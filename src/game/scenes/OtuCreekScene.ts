import * as Phaser from 'phaser';
import {EventBus} from '../EventBus';
import originalMap from '../data/otuCreekMap.json';
import {reconstructionPreview,previewRoutines} from '../data/reconstructionPreview';
import {drawReconstructionPreview} from './drawReconstructionPreview';
import {TerrainSystem, type TerrainZone} from '../systems/TerrainSystem';
import {GameplayState,PlayerMode} from '../systems/GameplayState';
import type {Facing} from '../characters/CharacterAnimator';
import {NpcRoutine} from '../npc/NpcRoutine';
import {AtlasCharacterAnimator} from '../characters/AtlasCharacterAnimator';
import {characterAtlases,type CharacterAtlasDefinition} from '../characters/CharacterAtlasRegistry';
import {applyDrowningPenalty,applyMissionChoice,restoreMission,serializeMission,type MissionStage} from '../systems/MissionProgress';
import {continuousBoatVelocity} from '../systems/BoatRules';

type Npc={name:string;role:string;anchor:Phaser.Physics.Arcade.Image;rig:AtlasCharacterAnimator;routine:NpcRoutine;label:Phaser.GameObjects.Text};
const A='/assets/naija-delta-boys/';
const preview=new URLSearchParams(window.location.search).get('world')==='reconstruction';
const map=preview?reconstructionPreview:originalMap;
const saveKey=preview?'ndb-reconstruction-preview':'ndb-mission';

export class OtuCreekScene extends Phaser.Scene{
 private player!:Phaser.Physics.Arcade.Image; private playerRig!:AtlasCharacterAnimator; private boat!:Phaser.Physics.Arcade.Image;
 private cursors!:Phaser.Types.Input.Keyboard.CursorKeys; private wasd!:Record<string,Phaser.Input.Keyboard.Key>;
 private obstacles!:Phaser.Physics.Arcade.StaticGroup; private terrain=new TerrainSystem(map.terrain as TerrainZone[],preview?map.roads:[]);
 private state=new GameplayState(); private npcs:Npc[]=[]; private near:Npc|null=null; private talkingTo:Npc|null=null; private touch=''; private dialogue=false;
 private stage:MissionStage='meet-timi'; private money=2500; private energy=100; private lives=3; private swim=map.player.swimSeconds;
 private lastDrain=0; private boundaryNotice=0; private checkpoint={x:map.respawn.x,y:map.respawn.y};
 constructor(){super('OtuCreekScene')}
 preload(){['mangrove_large','mangrove_small','jetty','palm','stilt_house','mama_ebi_kitchen','fish_market','community_hall','pos_shop','passenger_boat','billboard_frame','player','timi','tari','representative'].forEach(k=>this.load.image(k,`${A}sprites/${k}.png`));this.load.image('creekconnect-perspective',`${A}ads/creekconnect_perspective.png`);this.load.image('road-crossing',`${A}terrain-v5/dirt-road-crossing.png`);this.load.image('road-straight',`${A}terrain-v5/dirt-road-straight.png`);this.load.image('wooden-bridge-v5',`${A}terrain-v5/wooden-bridge.png`);this.load.image('shoreline-v5',`${A}terrain-v5/shoreline-transition.png`);Object.values(characterAtlases).forEach(a=>this.load.spritesheet(a.texture,`${A}${a.path}`,{frameWidth:a.frameWidth,frameHeight:a.frameHeight}))}
 create(){
  this.physics.world.setBounds(0,0,map.world.width,map.world.height);this.cameras.main.setBounds(0,0,map.world.width,map.world.height).setZoom(.96);
  this.drawWorld();this.obstacles=this.physics.add.staticGroup();this.placeWorld();
  this.player=this.physics.add.image(map.player.spawnX,map.player.spawnY,'player').setScale(.12).setAlpha(.001).setOrigin(.5,.96).setCollideWorldBounds(true).setDepth(map.player.spawnY);
  const playerArt=characterAtlases.player;this.playerRig=new AtlasCharacterAnimator(this,playerArt.texture,playerArt.scale,playerArt.phaseOffset,playerArt.rows,playerArt.footpoint).setPosition(map.player.spawnX,map.player.spawnY).setDepth(map.player.spawnY);
  this.player.body!.setSize(65,50).setOffset(60,450);this.physics.add.collider(this.player,this.obstacles);this.cameras.main.startFollow(this.player,true,.08,.08);
  this.cursors=this.input.keyboard!.createCursorKeys();this.wasd=this.input.keyboard!.addKeys('W,A,S,D,E,F') as Record<string,Phaser.Input.Keyboard.Key>;
  this.input.keyboard!.on('keydown-E',()=>this.interact());this.input.keyboard!.on('keydown-F',()=>this.enterWater());
  EventBus.on('interact',this.interact,this);EventBus.on('enter-water',this.enterWater,this);EventBus.on('move-start',(d:string)=>this.touch=d);EventBus.on('move-stop',()=>this.touch='');EventBus.on('dialogue-choice',this.choice,this);
  const saved=restoreMission(localStorage.getItem(saveKey)??(preview?localStorage.getItem('ndb-mission'):null),{stage:this.stage,money:this.money});this.stage=saved.stage;this.money=saved.money;
  this.state.reset();this.emitHud();this.emitWater();EventBus.emit('current-scene-ready',this);
 }
 private drawWorld(){
  if(preview){drawReconstructionPreview(this);return}
  const g=this.add.graphics().setDepth(-10);g.fillStyle(0x087d96).fillRect(0,0,map.world.width,map.world.height);g.fillStyle(0x36adc0,.35).fillRect(350,0,110,map.world.height);
  g.fillStyle(0xd9b76f).beginPath().moveTo(460,0).lineTo(1900,0).lineTo(1900,1250).lineTo(460,1250).closePath().fillPath();
  g.fillStyle(0x75a85b,.6);for(let x=500;x<1850;x+=128)for(let y=50;y<1200;y+=64)if((x+y)%256===0)g.fillPoints([new Phaser.Math.Vector2(x,y+30),new Phaser.Math.Vector2(x+60,y),new Phaser.Math.Vector2(x+120,y+30),new Phaser.Math.Vector2(x+60,y+60)],true);
  for(const road of map.roads){const width=Math.min(road.width,road.id==='main'?58:46);g.lineStyle(width+8,0x739250,.5).beginPath().moveTo(road.points[0][0],road.points[0][1]);for(const [x,y] of road.points.slice(1))g.lineTo(x,y);g.strokePath();g.lineStyle(width,0xc79a60,.92).beginPath().moveTo(road.points[0][0],road.points[0][1]);for(const [x,y] of road.points.slice(1))g.lineTo(x,y);g.strokePath();for(const [x,y] of road.points)g.fillStyle(0xc79a60,.92).fillCircle(x,y,width/2)}
  for(let i=0;i<10;i++)g.lineStyle(2,0x9eeaf0,.25).strokeEllipse(80+i*27,100+i*112,145,35);
 }
 private placeWorld(){
  this.add.image(420,705,'wooden-bridge-v5').setScale(.62).setDepth(704);
  this.place('stilt_house',560,220,.7,170,66);this.place('mama_ebi_kitchen',1120,350,.76,215,78);this.place('fish_market',760,780,.72,220,70);this.place('community_hall',1480,710,.6,260,75);this.place('pos_shop',1450,310,.7,110,62);
  this.add.image(335,720,'jetty').setScale(.6).setDepth(720);this.add.image(335,335,'jetty').setScale(.6).setDepth(335);
  this.boat=this.physics.add.image(map.boat.spawnX,map.boat.spawnY,'passenger_boat').setScale(.54).setDepth(map.boat.spawnY).setImmovable(true);
  this.add.image(160,180,'mangrove_large').setScale(.62).setDepth(180);this.add.image(210,1060,'mangrove_small').setScale(.62).setDepth(1060);
  [[900,180],[1240,160],[1670,390],[1660,900]].forEach(([x,y])=>this.add.image(x,y,'palm').setScale(.52).setOrigin(.5,.94).setDepth(y));
  const f=this.add.image(1540,530,'billboard_frame').setScale(.9).setDepth(530);this.add.image(f.x,f.y,'creekconnect-perspective').setScale(.9).setDepth(531);
  this.addNpc('Timi','Boatman','timi',485,preview?700:690,preview?previewRoutines.timi:[[485,690],[430,715],[475,735]],characterAtlases.timi);
  this.addNpc('Tari','Fish seller','tari',preview?780:1030,preview?870:800,preview?previewRoutines.tari:[[930,650],[1030,800],[930,950],[780,950]],characterAtlases.tari);
  this.addNpc('Chief Amakiri','Community representative','representative',preview?1480:1530,preview?820:800,preview?previewRoutines.chief:[[1435,650],[1530,800],[1435,950],[1100,950]],characterAtlases.representative);
 }
 private place(k:string,x:number,y:number,s:number,w:number,h:number){this.add.image(x,y,k).setScale(s).setOrigin(.5,.92).setDepth(y);const z=this.add.rectangle(x,y-h/2,w,h,0,0);this.physics.add.existing(z,true);this.obstacles.add(z)}
 private addNpc(name:string,role:string,k:string,x:number,y:number,waypoints:{x:number;y:number}[]|number[][],art:CharacterAtlasDefinition){const anchor=this.physics.add.image(x,y,k).setScale(.05).setAlpha(.001).setImmovable(true);const rig=new AtlasCharacterAnimator(this,art.texture,art.scale,art.phaseOffset,art.rows,art.footpoint).setPosition(x,y).setDepth(y);const label=this.add.text(x,y-112,name,{fontFamily:'Arial',fontSize:'18px',fontStyle:'bold',color:'#fff',backgroundColor:'#173b3ccc',padding:{x:8,y:4}}).setOrigin(.5).setDepth(y+1);const points=waypoints.map(p=>Array.isArray(p)?{x:p[0],y:p[1]}:p);this.npcs.push({name,role,anchor,rig,routine:new NpcRoutine(points,34+art.phaseOffset*2,art.phaseOffset,this.terrain),label})}
 private inputVector(){const l=this.cursors.left.isDown||this.wasd.A.isDown||this.touch==='left',r=this.cursors.right.isDown||this.wasd.D.isDown||this.touch==='right',u=this.cursors.up.isDown||this.wasd.W.isDown||this.touch==='up',d=this.cursors.down.isDown||this.wasd.S.isDown||this.touch==='down';let x=+r-+l,y=+d-+u;const n=Math.hypot(x,y)||1;return{x:x/n,y:y/n,moving:!!(x||y)}}
 update(time:number,delta:number){
  const v=this.inputVector();this.updateNpcs(delta);if(this.dialogue){this.player.setVelocity(0);this.syncPlayerRig(delta);return}
  if(this.state.mode===PlayerMode.OnFoot)this.updateFoot(v,time);else if(this.state.mode===PlayerMode.BoatDriver)this.updateBoat(v);else if(this.state.mode===PlayerMode.Swimming)this.updateSwim(v,delta);else{this.player.setVelocity(0);this.boat.setVelocity(0)}
  this.player.setDepth(this.player.y);this.boat.setDepth(this.boat.y);this.syncPlayerRig(delta);this.updatePrompt();(window as unknown as {__NDB_DEBUG__:unknown}).__NDB_DEBUG__={mode:this.state.mode,player:{x:Math.round(this.player.x),y:Math.round(this.player.y),terrain:this.terrain.at(this.player.x,this.player.y),visible:this.player.visible},boat:{x:Math.round(this.boat.x),y:Math.round(this.boat.y),terrain:this.terrain.at(this.boat.x,this.boat.y)},swim:Math.ceil(this.swim),lives:this.lives,money:this.money};
 }
 private syncPlayerRig(delta:number){const velocity=this.player.body?.velocity??new Phaser.Math.Vector2();const moving=Math.abs(velocity.x)+Math.abs(velocity.y)>3;if(moving)this.playerRig.setFacing(this.facing(velocity.x,velocity.y));const anim=this.state.mode===PlayerMode.Swimming?'swim':this.state.mode===PlayerMode.BoatDriver?'boat':moving?'walk':this.dialogue?'talk':'idle';this.playerRig.setState(anim).setPosition(this.player.x,this.player.y).setDepth(this.player.y).setVisible(this.player.visible);this.playerRig.update(delta,Math.hypot(velocity.x,velocity.y)/map.player.walkSpeed)}
 private updateNpcs(delta:number){for(let i=0;i<this.npcs.length;i++){const npc=this.npcs[i],playerDistance=Phaser.Math.Distance.Between(npc.anchor.x,npc.anchor.y,this.player.x,this.player.y),step=playerDistance<48&&this.state.mode===PlayerMode.OnFoot?{x:0,y:0,moving:false,facing:null}:npc.routine.step(npc.anchor,delta);if(step.moving){const nx=npc.anchor.x+step.x,ny=npc.anchor.y+step.y;if(this.terrain.canWalk(nx,ny)){npc.anchor.x=nx;npc.anchor.y=ny}if(step.facing)npc.rig.setFacing(step.facing)}for(let j=0;j<i;j++){const other=this.npcs[j],dx=npc.anchor.x-other.anchor.x,dy=npc.anchor.y-other.anchor.y,d=Math.hypot(dx,dy);if(d>0&&d<42){const nx=npc.anchor.x+dx/d*.35,ny=npc.anchor.y+dy/d*.35;if(this.terrain.canWalk(nx,ny)){npc.anchor.x=nx;npc.anchor.y=ny}}}npc.rig.setState(npc.routine.state==='talk'?'talk':step.moving?'walk':'idle').setPosition(npc.anchor.x,npc.anchor.y).setDepth(npc.anchor.y);npc.rig.update(delta,npc.routine.speed/42);npc.label.setPosition(npc.anchor.x,npc.anchor.y-112).setDepth(npc.anchor.y+1)}}
 private facing(x:number,y:number):Facing{return y<0?(x<0?'up-left':'up-right'):(x<0?'down-left':'down-right')}
 private updateFoot(v:{x:number;y:number;moving:boolean},time:number){
  if(!v.moving){this.player.setVelocity(0);return}const speed=map.player.walkSpeed;const nx=this.player.x+v.x*speed/60,ny=this.player.y+v.y*speed/60;
  if(!this.terrain.canWalk(nx,ny)){this.player.setVelocity(0);if(time-this.boundaryNotice>900){EventBus.emit('interaction-prompt','Deep water — use a boat, or press F to swim');this.boundaryNotice=time}return}
  this.player.setVelocity(v.x*speed,v.y*speed).setFlipX(v.x<0);this.checkpoint={x:this.player.x,y:this.player.y};if(time-this.lastDrain>3500){this.energy=Math.max(0,this.energy-1);this.lastDrain=time;this.emitHud()}
 }
 private updateBoat(v:{x:number;y:number;moving:boolean}){const speed=map.boat.speed,nx=this.boat.x+v.x*speed/60,ny=this.boat.y+v.y*speed/60,velocity=continuousBoatVelocity(v,speed,this.terrain.canBoat(nx,ny));this.boat.setVelocity(velocity.x,velocity.y);if(v.moving&&velocity.x!==0)this.boat.setFlipX(v.x<0)}
 private updateSwim(v:{x:number;y:number;moving:boolean},delta:number){const speed=map.player.swimSpeed;if(v.moving){const nx=this.player.x+v.x*speed/60,ny=this.player.y+v.y*speed/60;if(this.terrain.canSwim(nx,ny))this.player.setVelocity(v.x*speed,v.y*speed);else{this.player.setVelocity(0);this.reachShore()}}else this.player.setVelocity(0);this.swim=Math.max(0,this.swim-delta/1000);this.emitWater();if(this.swim<=0)this.drown()}
 private nearestDock(){return map.docks.map(d=>({d,dist:Phaser.Math.Distance.Between(this.boat.x,this.boat.y,d.boatX,d.boatY)})).sort((a,b)=>a.dist-b.dist)[0]}
 private canBoard(){return this.state.mode===PlayerMode.OnFoot&&this.terrain.at(this.player.x,this.player.y)==='jetty'&&Phaser.Math.Distance.Between(this.player.x,this.player.y,this.boat.x,this.boat.y)<220&&this.nearestDock().dist<this.nearestDock().d.radius}
 private interact(){
  if(this.dialogue)return;if(this.state.mode===PlayerMode.BoatDriver){const dock=this.nearestDock();if(dock.dist<=dock.d.radius)this.disembark(dock.d);else EventBus.emit('interaction-prompt','Disembark only at a marked jetty');return}
  if(this.canBoard()){this.board();return}if(!this.near)return;const n=this.near;
  if(n.name==='Timi'&&this.stage==='meet-timi')this.open(n,'Take this parcel to Tari at the fish market. Can I count on you?',[['Take the parcel','accept'],['Ask about the work','explain']]);else if(n.name==='Tari'&&this.stage==='deliver')this.open(n,'Timi’s parcel—right on time. This keeps today’s market moving.',[['Hand over parcel','delivered']]);else if(n.name==='Timi'&&this.stage==='return')this.open(n,'Tari sent word. Clean work. Here is ₦1,500.',[['Collect reward','reward']]);else if(n.name==='Chief Amakiri')this.open(n,'Otu Creek grows when neighbours keep their word.',[['Thank him','close']]);else this.open(n,this.stage==='complete'?'Otu Creek remembers reliable people.':'Nothing needed here just yet.',[['Close','close']])
 }
 private board(){this.state.transition(PlayerMode.Boarding);this.player.setVelocity(0).setVisible(false);this.playerRig.setVisible(false);this.state.transition(PlayerMode.BoatDriver);this.cameras.main.startFollow(this.boat,true,.08,.08);this.emitWater();EventBus.emit('interaction-prompt','Boat controls active — steer with movement keys')}
 private disembark(d:typeof map.docks[number]){this.boat.setVelocity(0).setPosition(d.boatX,d.boatY);this.state.transition(PlayerMode.OnFoot);this.player.setPosition(d.landX,d.landY).setVisible(true).clearTint();this.playerRig.setVisible(true);this.checkpoint={x:d.landX,y:d.landY};this.cameras.main.startFollow(this.player,true,.08,.08);this.emitWater()}
 private enterWater(){if(this.dialogue||this.state.mode!==PlayerMode.OnFoot)return;const t=this.terrain.at(this.player.x,this.player.y);if(t!=='jetty'&&this.player.x>540){EventBus.emit('interaction-prompt','Enter water only from the shoreline or jetty');return}this.state.transition(PlayerMode.Swimming);this.player.setPosition(385,this.player.y).setTint(0x8de3ef);this.swim=map.player.swimSeconds;this.emitWater();EventBus.emit('interaction-prompt','Swimming — reach the bright shoreline before stamina runs out')}
 private reachShore(){if(this.player.x>=395){this.state.transition(PlayerMode.OnFoot);this.player.setPosition(Math.max(470,this.checkpoint.x),this.player.y).clearTint();this.swim=map.player.swimSeconds;this.emitWater()}}
 private drown(){if(this.state.mode!==PlayerMode.Swimming)return;this.state.transition(PlayerMode.Drowning);this.player.setVelocity(0);EventBus.emit('interaction-prompt','Stamina depleted — returning to the last safe jetty');this.tweens.add({targets:this.playerRig.root,alpha:0,duration:900,onComplete:()=>this.respawn()})}
 private respawn(){this.state.transition(PlayerMode.Respawning);const penalty=applyDrowningPenalty(this.money,this.lives,map.respawn.moneyPenalty);this.money=penalty.money;this.lives=penalty.lives;this.player.setPosition(this.checkpoint.x,this.checkpoint.y).setAlpha(.001).clearTint().setVisible(true);this.playerRig.setPosition(this.checkpoint.x,this.checkpoint.y).setAlpha(1).setVisible(true);this.swim=map.player.swimSeconds;this.state.transition(PlayerMode.OnFoot);this.cameras.main.startFollow(this.player,true,.08,.08);this.save();this.emitHud();this.emitWater();EventBus.emit('interaction-prompt',`Safe respawn — ₦${map.respawn.moneyPenalty} recovery cost`)}
 private updatePrompt(){if(this.state.mode===PlayerMode.BoatDriver){const dock=this.nearestDock();EventBus.emit('interaction-prompt',dock.dist<=dock.d.radius?'Docked — press E to disembark':'Steer to a marked jetty to disembark');return}if(this.state.mode===PlayerMode.Swimming)return;const nearest=this.npcs.map(n=>({n,d:Phaser.Math.Distance.Between(this.player.x,this.player.y,n.anchor.x,n.anchor.y)})).sort((a,b)=>a.d-b.d)[0];this.near=nearest?.d<125?nearest.n:null;if(this.canBoard())EventBus.emit('interaction-prompt','Board Boat');else EventBus.emit('interaction-prompt',this.near?`Talk to ${this.near.name} — ${this.near.role}`:'Explore Otu Creek')}
 private open(n:Npc,text:string,c:[string,string][]){this.dialogue=true;this.talkingTo=n;n.routine.pauseForTalk();n.rig.setFacing(this.facing(this.player.x-n.anchor.x,this.player.y-n.anchor.y)).setState('talk');this.playerRig.setFacing(this.facing(n.anchor.x-this.player.x,n.anchor.y-this.player.y)).setState('talk');this.player.setVelocity(0);EventBus.emit('dialogue-open',{speaker:n.name,text,choices:c.map(([label,action])=>({label,action}))})}
 private choice(a:string){if(a==='explain'){EventBus.emit('dialogue-open',{speaker:'Timi',text:'A sealed market parcel—straight to Tari, then return to me.',choices:[{label:'I’ll do it',action:'accept'}]});return}const next=applyMissionChoice({stage:this.stage,money:this.money},a);this.stage=next.stage;this.money=next.money;this.talkingTo?.routine.resume();this.talkingTo=null;this.dialogue=false;EventBus.emit('dialogue-open',null);this.save();this.emitHud()}
 private save(){localStorage.setItem(saveKey,serializeMission({stage:this.stage,money:this.money}))}
 private emitHud(){const objective={'meet-timi':'Find Timi at the jetty','deliver':'Deliver the parcel to Tari','return':'Return to Timi for payment','complete':'Delivery complete — explore Otu Creek'}[this.stage];EventBus.emit('hud-update',{money:this.money,energy:this.energy,location:'Otu Creek Waterfront',objective})}
 private emitWater(){EventBus.emit('water-state',{mode:this.state.mode,swim:Math.ceil(this.swim),swimMax:map.player.swimSeconds,lives:this.lives,showSwim:this.state.mode===PlayerMode.Swimming})}
}
