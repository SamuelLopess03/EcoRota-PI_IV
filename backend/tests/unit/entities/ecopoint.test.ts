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
    console.log("\n==============================");
    console.log("[Ecopoint] Iniciando teste");
    console.log("==============================");

    const dates = makeDates();
    console.log("[Ecopoint] Datas:");
    console.log("  createdAt =", dates.createdAt.toISOString());
    console.log("  updatedAt =", dates.updatedAt.toISOString());

    const materials = makeAcceptedMaterials();
    const address = makeAddress();
    const days = makeCollectionDays();
    const time = makeCollectionTime();

    console.log("[Ecopoint] VOs (obj):");
    console.log("  materials =", materials);
    console.log("  address =", address);
    console.log("  days =", days);
    console.log("  time =", time);

    const ecopoint = new Ecopoint(
      1,
      "Ecoponto A",
      null, // partnerName
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

    console.log("[Ecopoint] Ecopoint criado:");
    console.log("  id =", ecopoint.id);
    console.log("  name =", ecopoint.name);
    console.log("  neighborhoodId =", ecopoint.neighborhoodId);
    console.log("  adminIdCreated =", ecopoint.adminIdCreated);
    console.log("  adminIdUpdated =", ecopoint.adminIdUpdated);

    expect(ecopoint.id).toBe(1);
    expect(ecopoint.name).toBe("Ecoponto A");
    expect(ecopoint.neighborhoodId).toBe(5);
    expect(ecopoint.adminIdCreated).toBe(10);
    expect(ecopoint.adminIdUpdated).toBeNull();

    console.log("[Ecopoint] ✅ OK");
  });
});
