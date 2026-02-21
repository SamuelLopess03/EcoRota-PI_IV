import { Subscriber } from "../../src/domain/entities/Subscriber.js";
import { Neighborhood } from "../../src/domain/entities/Neighborhood.js";
import { Administrator } from "../../src/domain/entities/Administrator.js";
import { Route } from "../../src/domain/entities/Route.js";
import { Ecopoint } from "../../src/domain/entities/Ecopoint.js";
import { ProblemReport } from "../../src/domain/entities/ProblemReport.js";
import { 
  makeDates, 
  makeEmail, 
  makeAddress, 
  makePopulationEstimate, 
  makePostalCode, 
  makeGeoLocation, 
  makeCollectionDays, 
  makeCollectionTime, 
  makeCollectionType, 
  makeAcceptedMaterials, 
  makeProblemProtocol, 
  makeProblemAttachments, 
  makeProblemStatus, 
  makeProblemDescription, 
  makeProblemType 
} from "./valueObjectFactories.js";

export const makeAdministrator = (overrides?: Partial<Administrator>) => {
  const dates = makeDates();
  return new Administrator(
    overrides?.id ?? 1,
    overrides?.name ?? "Admin Test",
    overrides?.email ?? makeEmail(),
    overrides?.password ?? "hashed-password",
    overrides?.createdAt ?? dates.createdAt,
    overrides?.updatedAt ?? dates.updatedAt
  );
};

export const makeSubscriber = (overrides?: Partial<Subscriber>) => {
  const dates = makeDates();
  return new Subscriber(
    overrides?.id ?? 1,
    overrides?.email ?? makeEmail("user@tester.com"),
    overrides?.address ?? makeAddress(),
    overrides?.neighborhoodId ?? 10,
    overrides?.createdAt ?? dates.createdAt,
    overrides?.updatedAt ?? dates.updatedAt
  );
};

export const makeNeighborhood = (overrides?: Partial<Neighborhood>) => {
  const dates = makeDates();
  return new Neighborhood(
    overrides?.id ?? 10,
    overrides?.name ?? "Bairro Centro",
    overrides?.populationEstimate ?? makePopulationEstimate(),
    overrides?.postalCode ?? makePostalCode(),
    overrides?.geoLocation ?? makeGeoLocation(),
    overrides?.createdAt ?? dates.createdAt,
    overrides?.updatedAt ?? dates.updatedAt,
    overrides?.routeId ?? 5,
    overrides?.adminIdCreated ?? 1,
    overrides?.adminIdUpdated ?? null
  );
};

export const makeRoute = (overrides?: Partial<Route>) => {
  const dates = makeDates();
  return new Route(
    overrides?.id ?? 5,
    overrides?.name ?? "Rota 01",
    overrides?.collectionDays ?? makeCollectionDays(),
    overrides?.collectionTime ?? makeCollectionTime(),
    overrides?.collectionType ?? makeCollectionType(),
    overrides?.createdAt ?? dates.createdAt,
    overrides?.updatedAt ?? dates.updatedAt,
    overrides?.adminIdCreated ?? 1,
    overrides?.adminIdUpdated ?? null
  );
};

export const makeEcopoint = (overrides?: Partial<Ecopoint>) => {
  const dates = makeDates();
  return new Ecopoint(
    overrides?.id ?? 1,
    overrides?.name ?? "Ecoponto Solar",
    overrides?.partnerName ?? "Prefeitura",
    overrides?.acceptedMaterials ?? makeAcceptedMaterials(),
    overrides?.geoLocation ?? makeGeoLocation(),
    overrides?.collectionDays ?? makeCollectionDays(),
    overrides?.collectionTime ?? makeCollectionTime(),
    overrides?.neighborhoodId ?? 10,
    overrides?.adminIdCreated ?? 1,
    overrides?.adminIdUpdated ?? null,
    overrides?.createdAt ?? dates.createdAt,
    overrides?.updatedAt ?? dates.updatedAt
  );
};

export const makeProblemReport = (overrides?: Partial<ProblemReport>) => {
  const dates = makeDates();
  return new ProblemReport(
    overrides?.id ?? 1,
    overrides?.protocol ?? makeProblemProtocol(),
    overrides?.attachments ?? makeProblemAttachments(),
    overrides?.status ?? makeProblemStatus(),
    overrides?.description ?? makeProblemDescription(),
    overrides?.problemType ?? makeProblemType(),
    overrides?.createdAt ?? dates.createdAt,
    overrides?.updatedAt ?? dates.updatedAt,
    overrides?.subscriberId ?? 1,
    overrides?.resolvedByAdminId ?? null,
    overrides?.justification ?? null
  );
};
