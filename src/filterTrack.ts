import { normalizeCoordinate } from "@arijitgupta/geo-core";
import { distanceBetween } from "@arijitgupta/geo-distance";
import type { CoordinateInput } from "@arijitgupta/geo-core";
import type { FilterTrackOptions, FilterTrackResult, NormalizedTrackPoint, TrackPoint } from "./types.js";
function validateThreshold(name:string,value:number|undefined):void {
 if(value===undefined)return;
 if(typeof value!=="number"||!Number.isFinite(value))throw new TypeError(name+" must be a finite number");
 if(value<0)throw new RangeError(name+" must not be negative");
}
function normalizePoint(value:TrackPoint|CoordinateInput,index:number):NormalizedTrackPoint {
 const wrapped=typeof value==="object"&&value!==null&&"coordinate" in value;
 const raw:TrackPoint=wrapped?value as TrackPoint:{coordinate:value as CoordinateInput};
 const point:NormalizedTrackPoint={coordinate:normalizeCoordinate(raw.coordinate)};
 if(raw.timestamp!==undefined){
  if(typeof raw.timestamp!=="number"||!Number.isFinite(raw.timestamp))throw new TypeError("timestamp at index "+index+" must be finite");
  point.timestamp=raw.timestamp;
 }
 if(raw.accuracyMeters!==undefined){
  if(typeof raw.accuracyMeters!=="number"||!Number.isFinite(raw.accuracyMeters))throw new TypeError("accuracyMeters at index "+index+" must be finite");
  if(raw.accuracyMeters<0)throw new RangeError("accuracyMeters at index "+index+" must not be negative");
  point.accuracyMeters=raw.accuracyMeters;
 }
 return point;
}
/**
 * Filters chronological GPS observations. Accuracy is applied first, then
 * speed against the last retained timestamped observation, then distance
 * thinning. Missing timestamps skip the speed rule for that pair. If both
 * timestamps exist, a non-increasing time is rejected when speed filtering
 * is enabled. Rejected outliers never become the next reference point.
 */
export function filterTrack(input:readonly (TrackPoint|CoordinateInput)[],options:FilterTrackOptions={}):FilterTrackResult {
 if(!Array.isArray(input))throw new TypeError("Track must be an array");
 validateThreshold("maxAccuracyMeters",options.maxAccuracyMeters);
 validateThreshold("maxSpeedMetersPerSecond",options.maxSpeedMetersPerSecond);
 validateThreshold("minDistanceMeters",options.minDistanceMeters);
 const normalized=input.map(normalizePoint),points:NormalizedTrackPoint[]=[],retainedIndices:number[]=[],rejectedIndices:number[]=[];
 for(let i=0;i<normalized.length;i+=1){
  const point=normalized[i]!;
  if(options.maxAccuracyMeters!==undefined&&point.accuracyMeters!==undefined&&point.accuracyMeters>options.maxAccuracyMeters){rejectedIndices.push(i);continue;}
  const previous=points[points.length-1];
  if(previous&&options.maxSpeedMetersPerSecond!==undefined&&previous.timestamp!==undefined&&point.timestamp!==undefined){
   const elapsed=(point.timestamp-previous.timestamp)/1000;
   if(elapsed<=0){rejectedIndices.push(i);continue;}
   if(distanceBetween(previous.coordinate,point.coordinate)/elapsed>options.maxSpeedMetersPerSecond){rejectedIndices.push(i);continue;}
  }
  if(previous&&options.minDistanceMeters!==undefined&&distanceBetween(previous.coordinate,point.coordinate)<=options.minDistanceMeters){rejectedIndices.push(i);continue;}
  points.push(point);retainedIndices.push(i);
 }
 return {points,retainedIndices,rejectedIndices};
}
export function removeStationaryDuplicates(input:readonly (TrackPoint|CoordinateInput)[],toleranceMeters=0):FilterTrackResult {
 return filterTrack(input,{minDistanceMeters:toleranceMeters});
}
