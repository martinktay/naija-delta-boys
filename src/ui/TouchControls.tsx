import {useEffect,useRef} from 'react';
import {EventBus} from '../game/EventBus';
import {PointerMovement,type MoveDirection} from './PointerMovement';

const directions:{direction:MoveDirection;label:string}[]=[{direction:'up',label:'▲'},{direction:'left',label:'◀'},{direction:'down',label:'▼'},{direction:'right',label:'▶'}];

export function TouchControls(){
 const controller=useRef<PointerMovement|null>(null);
 if(!controller.current)controller.current=new PointerMovement(direction=>EventBus.emit('move-start',direction),()=>EventBus.emit('move-stop'));
 useEffect(()=>{
  const release=()=>controller.current?.cancel();
  const visibility=()=>{if(document.hidden)release()};
  window.addEventListener('blur',release);document.addEventListener('visibilitychange',visibility);
  return()=>{release();window.removeEventListener('blur',release);document.removeEventListener('visibilitychange',visibility)};
 },[]);
 const directionAt=(x:number,y:number)=>document.elementFromPoint(x,y)?.closest<HTMLElement>('[data-direction]')?.dataset.direction as MoveDirection|undefined;
 return <div className="touch" aria-label="Movement controls" onPointerMove={event=>controller.current?.move(event.pointerId,directionAt(event.clientX,event.clientY)??null)} onPointerUp={event=>controller.current?.release(event.pointerId)} onPointerCancel={event=>controller.current?.release(event.pointerId)} onLostPointerCapture={event=>controller.current?.release(event.pointerId)}>
  {directions.map(({direction,label})=><button key={direction} data-direction={direction} aria-label={`Move ${direction}`} onPointerDown={event=>{event.preventDefault();if(controller.current?.start(event.pointerId,direction))event.currentTarget.parentElement?.setPointerCapture(event.pointerId)}}>{label}</button>)}
 </div>;
}

