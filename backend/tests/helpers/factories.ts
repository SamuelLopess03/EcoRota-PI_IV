import { Email } from "../../src/domain/value-objects/Email.js";
import { Address } from "../../src/domain/value-objects/Address.js";
import { PostalCode } from "../../src/domain/value-objects/PostalCode.js";
import { GeoLocation } from "../../src/domain/value-objects/GeoLocation.js";
import { PopulationEstimate } from "../../src/domain/value-objects/PopulationEstimate.js";
import { CollectionDays } from "../../src/domain/value-objects/CollectionDays.js";
import { CollectionTime } from "../../src/domain/value-objects/CollectionTime.js";
import { CollectionType } from "../../src/domain/value-objects/CollectionType.js";
import { AcceptedMaterials } from "../../src/domain/value-objects/AcceptedMaterials.js";
import { MaterialType } from "../../src/domain/value-objects/MaterialType.js";
import { WeekDay } from "../../src/domain/value-objects/WeekDay.js";
import { ProblemProtocol } from "../../src/domain/value-objects/ProblemProtocol.js";
import { ProblemAttachments } from "../../src/domain/value-objects/ProblemAttachments.js";
import { ProblemStatus } from "../../src/domain/value-objects/ProblemStatus.js";
import { ProblemDescription } from "../../src/domain/value-objects/ProblemDescription.js";
import { ProblemType } from "../../src/domain/value-objects/ProblemType.js";

export const makeDates = (): { createdAt: Date; updatedAt: Date } => ({
  createdAt: new Date("2025-01-01T10:00:00.000Z"),
  updatedAt: new Date("2025-01-02T10:00:00.000Z"),
});

export const makeEmail = (value = "admin@ecorota.com") => new Email(value);

export const makeAddress = () =>
  new Address({
    street: "Rua A",
    number: "123",
    complement: "Casa",
    postalCode: new PostalCode("64000-000"),
    geoLocation: new GeoLocation(-5.0892, -42.8016),
  });

export const makeCollectionDays = () =>
  new CollectionDays([WeekDay.MONDAY, WeekDay.WEDNESDAY]);

export const makeCollectionTime = () => new CollectionTime("08:00", "12:00");

export const makeCollectionType = () => new CollectionType("Coleta seletiva");

export const makeAcceptedMaterials = () =>
  new AcceptedMaterials([MaterialType.PLASTIC, MaterialType.PAPER]);

export const makePopulationEstimate = () => new PopulationEstimate(12000);

export const makePostalCode = () => new PostalCode("64000-000");

export const makeGeoLocation = () => new GeoLocation(-5.0892, -42.8016);

export const makeProblemProtocol = () => new ProblemProtocol("PR-2025-0001");

export const makeProblemAttachments = () =>
  new ProblemAttachments(["https://img.com/1.png"]);

export const makeProblemStatus = () => new ProblemStatus("PENDING");

export const makeProblemDescription = () =>
  new ProblemDescription("Lixo espalhado na calçada há dias.");

export const makeProblemType = () => new ProblemType("Lixo espalhado");
