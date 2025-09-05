import FloodZoneMap, { FloodZone, Zone } from "./floodZoneMap"

describe('constructor', () => {
  it('should create a map with only one floodZone', () => {
    const floodZone : FloodZone = {
      zone: Zone.AE,
      leftBound: 2,
      rightBound: 4,
      topBound: 5,
      bottomBound: 1
    }

    const floodZoneMap = new FloodZoneMap([floodZone]);
    const map = floodZoneMap.getMap();

    // Number of rows
    expect(map.length).toEqual(5)
    // Number of columns
    map.forEach(row => {
      expect(row.length).toEqual(4);
    });

    // Spot checking
    expect(map[0][0]).toEqual(Zone.O);
    expect(map[1][1]).toEqual(Zone.O);
    expect(map[2][2]).toEqual(Zone.AE);
    expect(map[3][3]).toEqual(Zone.AE);
    expect(map[4][3]).toEqual(Zone.AE);
  })

  it('should create a map with only two floodZones', () => {
    const floodZoneOne : FloodZone = {
      zone: Zone.AE,
      leftBound: 0,
      rightBound: 2,
      topBound: 3,
      bottomBound: 1
    }

     const floodZoneTwo : FloodZone = {
      zone: Zone.VE,
      leftBound: 3,
      rightBound: 4,
      topBound: 2,
      bottomBound: 0
    }

    const floodZoneMap = new FloodZoneMap([floodZoneOne, floodZoneTwo]);
    const map = floodZoneMap.getMap();

    // Number of rows
    expect(map.length).toEqual(3)
    // Number of columns
    map.forEach(row => {
      expect(row.length).toEqual(4);
    });

    // Spot checking
    expect(map[0][0]).toEqual(Zone.O);
    expect(map[1][1]).toEqual(Zone.AE);
    expect(map[2][2]).toEqual(Zone.O);
    expect(map[0][3]).toEqual(Zone.VE);
    expect(map[2][3]).toEqual(Zone.O);
  })
})