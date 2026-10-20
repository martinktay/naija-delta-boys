import original from './otuCreekMap.json';

/** Isolated candidate: all coordinates are world pixels, not isometric tile indices.
 * Art remains 2:1 isometric; this layout does not reinterpret pixels as tile coordinates.
 * The committed original JSON is the immutable baseline for this candidate.
 */
export const reconstructionPreview = {
 ...original,
 terrain: original.terrain.filter(zone => zone.type !== 'path'),
 roads: [
  {id:'main',width:100,points:[[475,715],[650,650],[980,650],[1250,650],[1650,650]]},
  {id:'market',width:86,points:[[650,650],[590,830],[780,870],[980,870],[980,650]]},
  {id:'community',width:86,points:[[1250,650],[1250,820],[1480,820],[1650,820],[1650,650]]},
  {id:'north',width:86,points:[[475,330],[710,330],[850,460],[1250,460],[1450,370],[1650,460],[1650,650]]},
  {id:'residential',width:86,points:[[650,650],[850,460]]},
  {id:'kitchen',width:86,points:[[1120,410],[1120,460],[1250,460],[1250,650]]},
  {id:'south-dock',kind:'bridge',width:70,points:[[300,715],[475,715]]},
  {id:'north-dock',kind:'bridge',width:70,points:[[300,330],[475,330]]},
 ],
};

export const previewRoutines = {
 timi:[[485,700],[450,715],[430,715],[450,715]],
 tari:[[780,870],[980,870],[980,650],[650,650],[590,830]],
 chief:[[1480,820],[1250,820],[1250,650],[1650,650],[1650,820]],
};

export const previewDestinations = [
 {id:'spawn',x:980,y:650},
 {id:'timi',x:475,y:715},
 {id:'tari',x:780,y:870},
 {id:'kitchen-entrance',x:1120,y:410},
 {id:'community-meeting',x:1480,y:820},
 {id:'pos-entrance',x:1450,y:370},
 {id:'north-jetty',x:475,y:330},
];
