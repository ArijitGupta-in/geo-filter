import {normalizeCoordinate} from "./coordinate.js";
import {distanceMeters} from "./geodesy.js";
import type {CoordinateInput,FilterTrackOptions,FilterTrackResult,NormalizedTrackPoint,TrackPoint} from "./types.js";
function threshold(n:string,v:number|undefined):void{if(v===undefined)return;if(typeof v!=="number"||!Number.isFinite(v))throw new TypeError(n+" must be finite");if(v<0)throw new RangeError(n+" must not be negative");}
function normalizePoint(v:TrackPoint|CoordinateInput,i:number):NormalizedTrackPoint{
 const wrapped=typeof v==="object"&&v!==null&&"coordinate" in v,raw:TrackPoint=wrapped?v as TrackPoint:{coordinate:v as CoordinateInput};
 const p:NormalizedTrackPoint={coordinate:normalizeCoordinate(raw.coordinate)};
 if(raw.timestamp!==undefined){if(typeof raw.timestamp!=="number"||!Number.isFinite(raw.timestamp))throw new TypeError("timestamp at index "+i+" must be finite");p.timestamp=raw.timestamp;}
 if(raw.accuracyMeters!==undefined){if(typeof raw.accuracyMeters!=="number"||!Number.isFinite(raw.accuracyMeters))throw new TypeError("accuracyMeters at index "+i+" must be finite");if(raw.accuracyMeters<0)throw new RangeError("accuracyMeters at index "+i+" must not be negative");p.accuracyMeters=raw.accuracyMeters;}
 return p;
}
/** Accuracy, speed-outlier, then distance filtering; rejected points never become references. */
export function filterTrack(input:readonly(TrackPoint|CoordinateInput)[],options:FilterTrackOptions={}):FilterTrackResult{
 if(!Array.isArray(input))throw new TypeError("Track must be an array");
 if(typeof options!=="object"||options===null||Array.isArray(options))throw new TypeError("options must be an object");
 threshold("maxAccuracyMeters",options.maxAccuracyMeters);threshold("maxSpeedMetersPerSecond",options.maxSpeedMetersPerSecond);threshold("minDistanceMeters",options.minDistanceMeters);
 const normalized=input.map(normalizePoint),points:NormalizedTrackPoint[]=[],retainedIndices:number[]=[],rejectedIndices:number[]=[];
 for(let i=0;i<normalized.length;i+=1){const p=normalized[i]!;
  if(options.maxAccuracyMeters!==undefined&&p.accuracyMeters!==undefined&&p.accuracyMeters>options.maxAccuracyMeters){rejectedIndices.push(i);continue;}
  const prev=points[points.length-1];
  if(prev&&options.maxSpeedMetersPerSecond!==undefined&&prev.timestamp!==undefined&&p.timestamp!==undefined){
   const elapsed=(p.timestamp-prev.timestamp)/1000;if(elapsed<=0){rejectedIndices.push(i);continue;}
   if(distanceMeters(prev.coordinate,p.coordinate)/elapsed>options.maxSpeedMetersPerSecond){rejectedIndices.push(i);continue;}
  }
  if(prev&&options.minDistanceMeters!==undefined&&distanceMeters(prev.coordinate,p.coordinate)<=options.minDistanceMeters){rejectedIndices.push(i);continue;}
  points.push(p);retainedIndices.push(i);
 }
 return{points,retainedIndices,rejectedIndices};
}
export function removeStationaryDuplicates(input:readonly(TrackPoint|CoordinateInput)[],toleranceMeters=0):FilterTrackResult{return filterTrack(input,{minDistanceMeters:toleranceMeters});}
