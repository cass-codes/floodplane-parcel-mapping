import * as fs from 'fs';
import { BoundEntity, FloodZone, Zone } from "./floodZoneMap";

interface Parcel extends BoundEntity {
  id: string;
}

export default class FloodzoneFileParser {

  private floodZones: FloodZone[] = [];
  private parcels: Parcel[] = [];

  constructor(private filePath: string) {
    // Step 1. Find and Read the file - go line by line
    const content: string = fs.readFileSync(filePath, 'utf-8');
    const lines: string[] = content.split(/\r?\n/);

    // Step 2. Parse each line
    lines.forEach((line) => {
      // Step 2.1. Break up line by spaces
      const components = line.split(" ");
      // Step 2.3. With first space, determine if it's a floodzone or a parcel
      if (components[0] === "FLOODZONE") {
        this.floodZones.push(this.parseFloodZone(components))
      } else if (components[0] === "PARCEL") {
        this.parcels.push(this.parseParcel(components))
     } else {
        console.error("Unknown line in file starting with", components[0])
      }
    })
  }

  getFloodZones() : FloodZone[] {
    return this.floodZones;
  }

  getParcels(): Parcel[] {
    return this.parcels;
  }

  private parseFloodZone(components: string[]): FloodZone {
    if (components.length < 6) {
      throw new Error("Formatted incorrectly")
    }
    let zone;
    switch(components[1]) {
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
      id: components[1] || '',
    }
  }

  private parseBoundaries(gridComponents: string[]): BoundEntity {
    const xs: string[]= [];
    const ys: string[] = []
    gridComponents.forEach((xy) => {
      const [x, y] = xy.split(",");
      // @ts-expect-error TODO come back and fix these typescript errors
      xs.push(x);
      // @ts-expect-error TODO come back and fix these typescript errors - parsing is hard
      ys.push(y);
    });
    const orderedXs = xs.sort();
    const orderedYs = ys.sort();
    return {
      leftBound: Number(orderedXs[0]),
      rightBound: Number(orderedXs[orderedXs.length - 1]),
      topBound: Number(orderedYs[0]),
      bottomBound: Number(orderedYs[orderedYs.length - 1]),
    }
  }

}