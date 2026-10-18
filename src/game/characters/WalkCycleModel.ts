import type {CharacterAnimState,Facing} from './CharacterAnimator';

// Calibrated from visual inspection of the delivered atlas: front-facing rows first, rear-facing rows last.
export const directionRow:Record<Facing,number>={'up-left':3,'up-right':2,'down-left':1,'down-right':0};

export class WalkCycleModel{
 state:CharacterAnimState='idle';
 facing:Facing='down-right';
 elapsed=0;
 constructor(readonly phaseOffset=0,readonly frameDuration=100){}
 setState(state:CharacterAnimState){if(state!==this.state){this.state=state;if(state==='walk')this.elapsed=0}}
 setFacing(facing:Facing){this.facing=facing}
 update(delta:number){if(this.state==='walk')this.elapsed+=delta}
 get frame(){const phase=this.state==='walk'?Math.floor((this.elapsed+this.phaseOffset)/this.frameDuration)%8:this.state==='talk'?2:0;return directionRow[this.facing]*8+phase}
}
