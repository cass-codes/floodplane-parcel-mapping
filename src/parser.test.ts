import mock from "mock-fs";
import FloodzoneFileParser from "./parser"
import { Zone } from "./floodZoneMap";

describe('Parser', () => {
  beforeAll(() => {
    mock({
      './oneZone.txt': Buffer.from("FLOODZONE X 15,7 15,11 22,11 22,7"),
      './multipleZones.txt': Buffer.from(
        `FLOODZONE X 15,7 15,11 22,11 22,7
FLOODZONE AE 0,20 0,24 20,24 20,20
FLOODZONE AE 12,14 12,20 18,20 18,14
FLOODZONE VE 0,0 0,20 12,20 12,0`),
      './oneParcel.txt': Buffer.from("PARCEL 1 8,17 8,22 15,22 15,17"),
      "./manyParcels.txt": Buffer.from(
        `PARCEL 1 8,17 8,22 15,22 15,17
PARCEL 2 16,8 16,15 25,15 25,8
PARCEL 3 16,3 16,5 20,5 20,3`),
      "./everything.txt": Buffer.from(
        `FLOODZONE X 15,7 15,11 22,11 22,7
PARCEL 1 8,17 8,22 15,22 15,17
FLOODZONE AE 0,20 0,24 20,24 20,20
FLOODZONE AE 12,14 12,20 18,20 18,14
PARCEL 2 16,8 16,15 25,15 25,8
FLOODZONE VE 0,0 0,20 12,20 12,0
PARCEL 3 16,3 16,5 20,5 20,3`
      )
    })
  })

  afterAll(() => {
    mock.restore();
  })

  describe("floodZones", () => {
    it("should parse with one floodZone", () => {
      const parser = new FloodzoneFileParser("./oneZone.txt");
      expect(parser).toBeDefined();
      const floodZones = parser.getFloodZones();
      expect(floodZones).toEqual([ {
        zone: Zone.X,
        leftBound: 15,
        rightBound: 22,
        topBound: 11,
        bottomBound: 7
      } ])
    })

    it("should parse with multiple floodZones", () => {
      const parser = new FloodzoneFileParser("./multipleZones.txt");
      expect(parser).toBeDefined();
      const floodZones = parser.getFloodZones();
      expect(floodZones.length).toEqual(4)
      expect(floodZones).toEqual([
        {
          zone: Zone.X,
          leftBound: 15,
          rightBound: 22,
          topBound: 11,
          bottomBound: 7
        },
        {
          bottomBound: 20,
          leftBound: 0,
          rightBound: 20,
          topBound: 24,
          zone: 2,
        },
        {
          bottomBound: 14,
          leftBound: 12,
          rightBound: 18,
          topBound: 20,
          zone: 2,
        },
        {
          bottomBound: 0,
          leftBound: 0,
          rightBound: 12,
          topBound: 20,
          zone: 1,
        },
      ]);
    })
  })

  describe('parcels', () => {
    it("should parse one parcel", () => {
      const parser = new FloodzoneFileParser('./oneParcel.txt')
      expect(parser).toBeDefined();
      const parcels = parser.getParcels();
      expect(parcels).toEqual([
        {
          id: "1",
          leftBound: 8,
          rightBound: 15,
          topBound: 22,
          bottomBound: 17
        }
      ])
    });

    it("should parse multiple parcels", () => {
      const parser = new FloodzoneFileParser('./manyParcels.txt')
      expect(parser).toBeDefined();
      const parcels = parser.getParcels();
      expect(parcels).toEqual([
        {
          id: "1",
          leftBound: 8,
          rightBound: 15,
          topBound: 22,
          bottomBound: 17
        }, {
          bottomBound: 8,
          id: "2",
          leftBound: 16,
          rightBound: 25,
          topBound: 15,
        },
        {
          bottomBound: 3,
          id: "3",
          leftBound: 16,
          rightBound: 20,
          topBound: 5,
        },
      ]);
    })
  })

  describe("floodzones and parcels", () => {
    it("should parse everything regardless of order", () => {
      const parser = new FloodzoneFileParser('./everything.txt')
      expect(parser).toBeDefined();
      const parcels = parser.getParcels();
      expect(parcels).toEqual([
        {
          id: "1",
          leftBound: 8,
          rightBound: 15,
          topBound: 22,
          bottomBound: 17
        }, {
          bottomBound: 8,
          id: "2",
          leftBound: 16,
          rightBound: 25,
          topBound: 15,
        },
        {
          bottomBound: 3,
          id: "3",
          leftBound: 16,
          rightBound: 20,
          topBound: 5,
        },
      ]);
      const floodZones = parser.getFloodZones();
      expect(floodZones).toEqual([
        {
          zone: Zone.X,
          leftBound: 15,
          rightBound: 22,
          topBound: 11,
          bottomBound: 7
        },
        {
          bottomBound: 20,
          leftBound: 0,
          rightBound: 20,
          topBound: 24,
          zone: 2,
        },
        {
          bottomBound: 14,
          leftBound: 12,
          rightBound: 18,
          topBound: 20,
          zone: 2,
        },
        {
          bottomBound: 0,
          leftBound: 0,
          rightBound: 12,
          topBound: 20,
          zone: 1,
        },
      ]);

    })
  })
})