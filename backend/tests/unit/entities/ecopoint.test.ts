import { Ecopoint } from "../../../src/domain/entities/Ecopoint.js";
import {
  makeAcceptedMaterials,
  makeAddress,
  makeCollectionDays,
  makeCollectionTime,
  makeDates,
} from "../../helpers/factories.js";

describe("Entity: Ecopoint", () => {
  it("deve criar ecoponto com campos corretos", () => {
    const dates = makeDates();
    const materials = makeAcceptedMaterials();
    const address = makeAddress();
    const days = makeCollectionDays();
    const time = makeCollectionTime();

    const ecopoint = new Ecopoint(
      1,
      "Ecoponto A",
      null,
      materials,
      address.getGeoLocation()!,
      days,
      time,
      5,
      10,
      null,
      dates.createdAt,
      dates.updatedAt
    );

    expect(ecopoint.id).toBe(1);
    expect(ecopoint.name).toBe("Ecoponto A");
    expect(ecopoint.neighborhoodId).toBe(5);
    expect(ecopoint.adminIdCreated).toBe(10);
    expect(ecopoint.adminIdUpdated).toBeNull();
  });
});
