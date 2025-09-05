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
    console.log('topMostBOund', topMostBound);

    // Default them all too O or None
    for (let r = 0; r < topMostBound; r++) {
      const row: Zone[] = []
      for (let c = 0; c < rightMostBound; c++) {
        row.push(Zone.O);
      }
      this.map.push(row);
    }
    console.log('map', this.map);

    // Go through the floodzones and fill out the map
    floodZones.forEach(floodZone => {
      for (let r = floodZone.bottomBound; r < floodZone.topBound; r++) {
        for( let c = floodZone.leftBound; c < floodZone.rightBound; c++) {
          // @ts-expect-error TODO: come back and fix the typescript error here!
          this.map[r][c] = floodZone.zone;
        }
      }
    });
  }

  getMap() {
    return this.map;
  }
}