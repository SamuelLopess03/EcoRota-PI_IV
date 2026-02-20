import { Route } from "../../../src/domain/entities/Route.js";
import {
  makeCollectionDays,
  makeCollectionTime,
  makeCollectionType,
  makeDates,
} from "../../helpers/factories.js";

describe("Entity: Route", () => {
  it("deve criar uma rota com os campos corretos", () => {
    const dates = makeDates();
    const days = makeCollectionDays();
    const time = makeCollectionTime();
    const type = makeCollectionType();

    const route = new Route(
      1,
      "Rota Centro",
      days,
      time,
      type,
      dates.createdAt,
      dates.updatedAt,
      10,
      null
    );

    expect(route.id).toBe(1);
    expect(route.name).toBe("Rota Centro");
    expect(route.adminIdCreated).toBe(10);
    expect(route.adminIdUpdated).toBeNull();
  });
});
