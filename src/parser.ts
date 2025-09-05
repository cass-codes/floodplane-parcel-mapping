import * as fs from 'fs';
import { BoundEntity, FloodZone, Zone } from "./floodZoneMap";

interface Parcel extends BoundEntity {
  id: string;
}

export default class FloodzoneFileParser {

  private floodZones: FloodZone[] = [];
  private parcels: Parcel[] = [];

  constructor(private filePath: string) {
    const content: string = fs.readFileSync(filePath, 'utf-8');
    const lines: string[] = content.split(/\r?\n/);

    lines.forEach((line) => {
      const components = line.split(" ");
      if (components[ 0 ] === "FLOODZONE") {
        this.floodZones.push(this.parseFloodZone(components))
      } else if (components[ 0 ] === "PARCEL") {
        this.parcels.push(this.parseParcel(components))
      } else {
        console.error("Unknown line in file starting with", components[ 0 ])
      }
    })
  }

  getFloodZones(): FloodZone[] {
    return this.floodZones;
  }

  getParcels(): Parcel[] {
    return this.parcels;
  }

  private parseFloodZone(components: string[]): FloodZone {
    if (components.length !== 6) {
      throw new Error("Formatted incorrectly")
    }
    let zone;
    switch (components[ 1 ]) {
      case "VE":
        zone = Zone.VE;
        break;
      case "AE":
        zone = Zone.AE;
        break;
      case "X":
        zone = Zone.X;
        break;
      default:
        throw new Error("Formatted Incorrectly")
    }

    const bounds = this.parseBoundaries(components.splice(2))

    return {
      ...bounds,
      zone
    }
  }

  private parseParcel(components: string[]): Parcel {
    if (components.length < 6) {
      throw new Error("Formatted incorrectly")
    }
    const bounds = this.parseBoundaries(components.splice(2));
    return {
      ...bounds,
      id: components[ 1 ] || '',
    }
  }

  private parseBoundaries(gridComponents: string[]): BoundEntity {
    const xs: number[] = [];
    const ys: number[] = [];
    gridComponents.forEach((xy) => {
      const [ x, y ] = xy.split(",");
      xs.push(Number(x));
      ys.push(Number(y));
    });
    return {
      leftBound: Math.min(...xs),
      rightBound: Math.max(...xs),
      topBound: Math.max(...ys),
      bottomBound: Math.min(...ys),
    }
  }

}