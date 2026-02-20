import { Neighborhood } from "../../../src/domain/entities/Neighborhood.js";
import {
  makePopulationEstimate,
  makePostalCode,
  makeGeoLocation,
  makeDates,
} from "../../helpers/factories.js";

describe("Entity: Neighborhood", () => {
  it("deve criar neighborhood com VOs e ids", () => {
    const dates = makeDates();
    const pop = makePopulationEstimate();
    const postal = makePostalCode();
    const geo = makeGeoLocation();

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

    expect(n.name).toBe("Centro");
    expect(n.routeId).toBe(50);
    expect(n.adminIdCreated).toBe(10);
    expect(n.adminIdUpdated).toBeNull();
  });
});
