import FloodZoneMap from "./floodZoneMap";

export default class FloodzoneFileParser {

  public floodZoneMap: FloodZoneMap;
  public parcels: Parcel[];

  constructor(private filePath: string) {}
}