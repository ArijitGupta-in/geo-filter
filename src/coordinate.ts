import type {Coordinate,CoordinateInput,DMSCoordinate} from "./types.js";
function rec(v:unknown):v is Record<string,unknown>{return typeof v==="object"&&v!==null&&!Array.isArray(v);}
function finite(v:unknown,n:string):asserts v is number{if(typeof v!=="number"||!Number.isFinite(v))throw new TypeError(n+" must be finite");}
function axis(v:unknown,name:"latitude"|"longitude"):number{
 if(!rec(v))throw new TypeError(name+" DMS value must be an object");
 const max=name==="latitude"?90:180,pos=name==="latitude"?"N":"E",neg=name==="latitude"?"S":"W";
 finite(v.degrees,name+" degrees");finite(v.minutes,name+" minutes");finite(v.seconds,name+" seconds");
 if(v.direction!==pos&&v.direction!==neg)throw new TypeError(name+" direction must be "+pos+" or "+neg);
 if(!Number.isInteger(v.degrees)||v.degrees<0||v.degrees>max)throw new RangeError(name+" degrees out of range");
 if(!Number.isInteger(v.minutes)||v.minutes<0||v.minutes>=60)throw new RangeError(name+" minutes out of range");
 if(v.seconds<0||v.seconds>=60)throw new RangeError(name+" seconds out of range");
 const m=v.degrees+v.minutes/60+v.seconds/3600;if(m>max)throw new RangeError(name+" exceeds "+max+" degrees");
 return m===0?0:v.direction===neg?-m:m;
}
export function normalizeCoordinate(input:CoordinateInput):Coordinate{
 if(!rec(input))throw new TypeError("Coordinate must be an object");
 if(rec(input.latitude)){const d=input as unknown as DMSCoordinate;return{latitude:axis(d.latitude,"latitude"),longitude:axis(d.longitude,"longitude")};}
 const c=input as unknown as Coordinate;finite(c.latitude,"Latitude");finite(c.longitude,"Longitude");
 if(c.latitude< -90||c.latitude>90)throw new RangeError("Latitude must be between -90 and 90");
 if(c.longitude< -180||c.longitude>180)throw new RangeError("Longitude must be between -180 and 180");
 return{latitude:c.latitude,longitude:c.longitude===0?0:c.longitude};
}
