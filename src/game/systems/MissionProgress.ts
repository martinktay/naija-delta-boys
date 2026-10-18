export type MissionStage='meet-timi'|'deliver'|'return'|'complete';
export type MissionSnapshot={stage:MissionStage;money:number};

export function applyMissionChoice(snapshot:MissionSnapshot,action:string):MissionSnapshot{
 if(action==='accept'&&snapshot.stage==='meet-timi')return{...snapshot,stage:'deliver'};
 if(action==='delivered'&&snapshot.stage==='deliver')return{...snapshot,stage:'return'};
 if(action==='reward'&&snapshot.stage==='return')return{stage:'complete',money:snapshot.money+1500};
 return snapshot;
}

export function restoreMission(raw:string|null,fallback:MissionSnapshot):MissionSnapshot{
 if(!raw)return fallback;
 try{const value=JSON.parse(raw) as Partial<MissionSnapshot>;const stages:MissionStage[]=['meet-timi','deliver','return','complete'];return{stage:stages.includes(value.stage as MissionStage)?value.stage as MissionStage:fallback.stage,money:Number.isFinite(value.money)?value.money as number:fallback.money}}catch{return fallback}
}

export const serializeMission=(snapshot:MissionSnapshot)=>JSON.stringify(snapshot);
export const applyDrowningPenalty=(money:number,lives:number,penalty:number)=>({money:Math.max(0,money-penalty),lives:Math.max(0,lives-1)});

