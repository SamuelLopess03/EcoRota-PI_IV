import { Email } from "../../src/domain/value-objects/Email.js";
import { Address, AddressProps } from "../../src/domain/value-objects/Address.js";
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
import { ProblemJustification } from "../../src/domain/value-objects/ProblemJustification.js";

export const makeDates = (): { createdAt: Date; updatedAt: Date } => ({
  createdAt: new Date("2025-01-01T10:00:00.000Z"),
  updatedAt: new Date("2025-01-02T10:00:00.000Z"),
});

export const makeEmail = (value = "admin@ecorota.com") => new Email(value);

export const makeAddress = (overrides?: Partial<AddressProps>) =>
  new Address({
    street: overrides?.street ?? "Rua A",
    number: overrides?.number ?? "123",
    complement: overrides?.complement ?? "Casa",
    postalCode: overrides?.postalCode ?? new PostalCode("64000-000"),
    geoLocation: overrides?.geoLocation ?? new GeoLocation(-5.0892, -42.8016),
  });

export const makeCollectionDays = (days = [WeekDay.MONDAY, WeekDay.WEDNESDAY]) =>
  new CollectionDays(days);

export const makeCollectionTime = (startTime = "08:00", endTime = "12:00") =>
  new CollectionTime(startTime, endTime);

export const makeCollectionType = (value = "Coleta seletiva") =>
  new CollectionType(value);

export const makeAcceptedMaterials = (materials = [MaterialType.PLASTIC, MaterialType.PAPER]) =>
  new AcceptedMaterials(materials);

export const makePopulationEstimate = (value = 12000) =>
  new PopulationEstimate(value);

export const makePostalCode = (value = "64000-000") =>
  new PostalCode(value);

export const makeGeoLocation = (lat = -5.0892, lng = -42.8016) =>
  new GeoLocation(lat, lng);

export const makeProblemProtocol = (value = "PR-2025-0001") =>
  new ProblemProtocol(value);

export const makeProblemAttachments = (attachments: string[] | string = ["https://img.com/1.png"]) =>
  new ProblemAttachments(attachments);

export const makeProblemStatus = (value = "PENDING") =>
  new ProblemStatus(value);

export const makeProblemDescription = (value = "Lixo espalhado na calçada há dias.") =>
  new ProblemDescription(value);

export const makeProblemType = (value = "Lixo espalhado") =>
  new ProblemType(value);

export const makeProblemJustification = (value = "Justificativa válida com mais de dez caracteres.") =>
  new ProblemJustification(value);
