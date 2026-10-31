import type {Coordinate} from "./types.js";
const R=6_371_000,rad=Math.PI/180;
export function distanceMeters(a:Coordinate,b:Coordinate):number{
 const dLat=(b.latitude-a.latitude)*rad,dLon=(b.longitude-a.longitude)*rad,lat1=a.latitude*rad,lat2=b.latitude*rad;
 const h=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
 const central=2*Math.atan2(Math.sqrt(Math.max(0,Math.min(1,h))),Math.sqrt(Math.max(0,1-h)));
 return R*central;
}
