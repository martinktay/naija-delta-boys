import * as Phaser from 'phaser';
import {reconstructionPreview as map} from '../data/reconstructionPreview';

/** Terrain-only canvas texture. Buildings, people, boats and collisions stay independent. */
export function drawReconstructionPreview(scene:Phaser.Scene){
 const texture=scene.textures.createCanvas('reconstruction-ground',map.world.width,map.world.height)!;
 const c=texture.context;
 c.fillStyle='#137f8d';c.fillRect(0,0,map.world.width,map.world.height);
 c.fillStyle='#49aab0';c.fillRect(400,0,60,map.world.height);
 c.fillStyle='#678546';c.fillRect(460,0,map.world.width-460,map.world.height);
 // Deterministic texture; not a production substitute for illustrated grass transitions.
 let seed=17;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<18000;i++){
  const x=460+random()*1440,y=random()*1250;
  c.fillStyle=i%2?'#86a05b':'#526f3c';c.globalAlpha=.25;
  c.fillRect(x,y,1+random()*5,1+random()*2);
 }
 c.globalAlpha=1;
 // Sample only the sand surface, excluding the tile's raised sides and silhouette.
 const sample=document.createElement('canvas');sample.width=32;sample.height=20;
 sample.getContext('2d')!.drawImage(scene.textures.get('road-straight').getSourceImage() as HTMLImageElement,140,100,32,20,0,0,32,20);
 const sand=c.createPattern(sample,'repeat')!;
 for(const road of map.roads){
  if('kind' in road)continue;
  c.beginPath();road.points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));
  c.lineJoin='round';c.lineCap='round';c.lineWidth=road.width;c.strokeStyle=sand;c.stroke();
 }
 texture.refresh();scene.add.image(0,0,texture.key).setOrigin(0).setDepth(-10);
 // Existing canonical vegetation, separated from route corridors and building entrances.
 for(const [x,y] of [[530,100],[780,190],[980,230],[1320,150],[1740,230],[1770,540],[1770,920],[1150,1040],[620,1030]]){
  scene.add.image(x,y,'palm').setOrigin(.5,.94).setScale(.42).setDepth(y);
 }
 for(const [x,y] of [[140,130],[160,530],[170,1040],[340,1150]]){
  scene.add.image(x,y,'mangrove_large').setOrigin(.5,.88).setScale(.8).setDepth(y);
 }
 scene.add.text(350,20,'RECONSTRUCTION PREVIEW · save isolated',{fontSize:'14px',backgroundColor:'#18392c',padding:{x:10,y:8}})
  .setScrollFactor(0).setDepth(10000);
}
