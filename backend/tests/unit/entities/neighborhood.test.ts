import { Neighborhood } from "../../../src/domain/entities/Neighborhood.js";
import {
  makePopulationEstimate,
  makePostalCode,
  makeGeoLocation,
  makeDates,
} from "../../helpers/factories.js";

describe("Entity: Neighborhood", () => {
  it("deve criar neighborhood com VOs e ids", () => {
    console.log("\n==============================");
    console.log("[Neighborhood] Iniciando teste");
    console.log("==============================");

    const dates = makeDates();
    const pop = makePopulationEstimate();
    const postal = makePostalCode();
    const geo = makeGeoLocation();

    console.log("[Neighborhood] VOs (obj):", { pop, postal, geo });

    const n = new Neighborhood(
      1,
      "Centro",
      pop,
      postal,
      geo,
      dates.createdAt,
      dates.updatedAt,
      50,
      10,
      null
    );

    console.log("[Neighborhood] Neighborhood criado:", n);

    expect(n.name).toBe("Centro");
    expect(n.routeId).toBe(50);
    expect(n.adminIdCreated).toBe(10);
    expect(n.adminIdUpdated).toBeNull();

    console.log("[Neighborhood] ✅ OK");
  });
});
