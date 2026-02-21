import { Ecopoint } from "../../../src/domain/entities/Ecopoint.js";
import {
  makeAcceptedMaterials,
  makeCollectionDays,
  makeCollectionTime,
  makeDates,
  makeGeoLocation,
} from "../../helpers/valueObjectFactories.js";

describe("Entity: Ecopoint", () => {
  it("deve criar ecoponto com campos corretos", () => {
    const dates = makeDates();
    const materials = makeAcceptedMaterials();
    const geo = makeGeoLocation();
    const days = makeCollectionDays();
    const time = makeCollectionTime();

    const ecopoint = new Ecopoint(
      1,
      "Ecoponto A",
      null,
      materials,
      geo,
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
    expect(ecopoint.partnerName).toBeNull();
    expect(ecopoint.neighborhoodId).toBe(5);
    expect(ecopoint.adminIdCreated).toBe(10);
    expect(ecopoint.adminIdUpdated).toBeNull();
  });

  it("deve criar ecoponto com partnerName preenchido", () => {
    const dates = makeDates();
    const materials = makeAcceptedMaterials();
    const geo = makeGeoLocation();
    const days = makeCollectionDays();
    const time = makeCollectionTime();

    const ecopoint = new Ecopoint(
      1,
      "Ecoponto B",
      "Empresa X",
      materials,
      geo,
      days,
      time,
      5,
      10,
      null,
      dates.createdAt,
      dates.updatedAt
    );

    expect(ecopoint.partnerName).toBe("Empresa X");
  });
});
