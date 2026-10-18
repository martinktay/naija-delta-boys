import { AUTO,Game,Scale } from 'phaser'; import { OtuCreekScene } from './scenes/OtuCreekScene';
const config:Phaser.Types.Core.GameConfig={type:AUTO,width:1280,height:720,parent:'game-container',backgroundColor:'#167f91',scale:{mode:Scale.RESIZE,autoCenter:Scale.CENTER_BOTH},physics:{default:'arcade',arcade:{debug:false}},scene:[OtuCreekScene]};
export default (parent:string)=>new Game({...config,parent});
