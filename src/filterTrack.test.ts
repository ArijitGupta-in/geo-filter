import {describe,expect,it} from "vitest";
import {filterTrack,removeStationaryDuplicates} from "./index.js";
const p=(latitude:number,longitude:number)=>({latitude,longitude});
const s=(latitude:number,longitude:number,timestamp:number,accuracyMeters=5)=>({coordinate:p(latitude,longitude),timestamp,accuracyMeters});
describe("GPS track filtering",()=>{
 it("normalizes coordinate-only input",()=>expect(filterTrack([p(0,0),p(0,1)]).points.map(x=>x.coordinate)).toEqual([p(0,0),p(0,1)]));
 it("filters poor accuracy",()=>{const r=filterTrack([s(0,0,0,3),s(0,.001,1000,80)],{maxAccuracyMeters:20});expect(r.retainedIndices).toEqual([0]);expect(r.rejectedIndices).toEqual([1]);});
 it("rejects speed outliers against last retained sample",()=>{const r=filterTrack([s(0,0,0),s(0,1,1000),s(0,.0001,10000)],{maxSpeedMetersPerSecond:50});expect(r.retainedIndices).toEqual([0,2]);expect(r.rejectedIndices).toEqual([1]);});
 it("skips speed when timestamps are missing",()=>expect(filterTrack([p(0,0),p(0,1)],{maxSpeedMetersPerSecond:1}).points).toHaveLength(2));
 it("rejects non-increasing timestamps",()=>expect(filterTrack([s(0,0,1000),s(0,.0001,1000)],{maxSpeedMetersPerSecond:10}).rejectedIndices).toEqual([1]));
 it("thins nearby observations",()=>expect(filterTrack([p(0,0),p(0,.000001),p(0,.01)],{minDistanceMeters:1}).retainedIndices).toEqual([0,2]));
 it("reports duplicate source indices",()=>{const r=removeStationaryDuplicates([p(0,0),p(0,0),p(0,1)]);expect(r.retainedIndices).toEqual([0,2]);expect(r.rejectedIndices).toEqual([1]);});
 it("validates metadata and options",()=>{expect(()=>filterTrack(null as never)).toThrow(TypeError);expect(()=>filterTrack([s(0,0,0)],{maxAccuracyMeters:-1})).toThrow(RangeError);expect(()=>filterTrack([{coordinate:p(0,0),timestamp:NaN}])).toThrow(TypeError);expect(()=>filterTrack([{coordinate:p(0,0),accuracyMeters:-1}])).toThrow(RangeError);expect(()=>filterTrack([p(91,0)])).toThrow(RangeError);});
});
