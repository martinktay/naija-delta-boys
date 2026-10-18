import type {Facing} from './CharacterAnimator';

export type CharacterAtlasDefinition={
 texture:string;
 path:string;
 frameWidth:number;
 frameHeight:number;
 scale:number;
 footpoint:{x:number;y:number};
 rows:Record<Facing,number>;
 phaseOffset:number;
};

export const characterAtlases={
 player:{texture:'player-production',path:'characters/player_walk_pilot_v1.png',frameWidth:192,frameHeight:256,scale:.43,footpoint:{x:.5,y:.94},rows:{'down-right':0,'down-left':1,'up-right':2,'up-left':3},phaseOffset:0},
 timi:{texture:'timi-production',path:'characters/timi_walk_v2.png',frameWidth:192,frameHeight:256,scale:.43,footpoint:{x:.5,y:.94},rows:{'down-right':0,'down-left':2,'up-right':1,'up-left':3},phaseOffset:2},
 tari:{texture:'tari-production',path:'characters/tari_walk_v1.png',frameWidth:222,frameHeight:222,scale:.5,footpoint:{x:.5,y:.94},rows:{'down-right':0,'down-left':1,'up-right':2,'up-left':3},phaseOffset:4},
 representative:{texture:'representative-production',path:'characters/representative_walk_v1.png',frameWidth:192,frameHeight:256,scale:.43,footpoint:{x:.5,y:.94},rows:{'down-right':0,'down-left':1,'up-right':2,'up-left':3},phaseOffset:6}
} satisfies Record<string,CharacterAtlasDefinition>;
