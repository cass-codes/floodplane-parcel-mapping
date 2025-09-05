export enum Zone {
  "O",
  "VE",
  "AE",
  "X"
}

export interface FloodZone {
  zone: Zone;
  leftBound: number;
  rightBound: number;
  topBound: number;
  bottomBound: number;
}

export default class FloodZoneMap {

  private map: Zone[][] = [];

  constructor(private floodZones: FloodZone[]) {
    let rightMostBound = 0;
    let topMostBound = 0;
    for(const floodZone of floodZones){
      if (floodZone.rightBound > rightMostBound) {
        rightMostBound = floodZone.rightBound
      }
      if (floodZone.topBound > topMostBound) {
        topMostBound = floodZone.topBound;
      }
    }
    console.log('rightMostBound', rightMostBound);
    console.log('topMostBOund', topMostBound)

    for (let r = 0; r < topMostBound; r++) {
      const row: Zone[] = []
      for (let c = 0; c < rightMostBound; c++) {
        row.push(Zone.O);
      }
      this.map.push(row);
    }
    console.log('map', this.map);
  }

  getMap() {
    return this.map;
  }
}