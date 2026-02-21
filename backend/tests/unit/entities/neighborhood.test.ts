import { Neighborhood } from "../../../src/domain/entities/Neighborhood.js";
import {
  makePopulationEstimate,
  makePostalCode,
  makeGeoLocation,
  makeDates,
} from "../../helpers/valueObjectFactories.js";

describe("Entity: Neighborhood", () => {
  it("deve criar neighborhood com VOs válidos", () => {
    const dates = makeDates();
    const population = makePopulationEstimate();
    const postal = makePostalCode();
    const geo = makeGeoLocation();

    const n = new Neighborhood(
      1,
      "Centro",
      population,
      postal,
      geo,
      dates.createdAt,
      dates.updatedAt,
      50,
      10,
      null
    );

    expect(n.id).toBe(1);
    expect(n.name).toBe("Centro");
    expect(n.populationEstimate.getValue()).toBe(12000);
    expect(n.postalCode.getValue()).toBe("64000000");
    expect(n.geoLocation.toString()).toBe("-5.0892,-42.8016");
    expect(n.routeId).toBe(50);
    expect(n.adminIdCreated).toBe(10);
    expect(n.adminIdUpdated).toBeNull();
  });
});
