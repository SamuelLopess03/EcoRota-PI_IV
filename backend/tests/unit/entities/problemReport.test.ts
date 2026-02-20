import { ProblemReport } from "../../../src/domain/entities/ProblemReport.js";
import {
  makeProblemProtocol,
  makeProblemAttachments,
  makeProblemStatus,
  makeProblemDescription,
  makeProblemType,
  makeDates,
} from "../../helpers/factories.js";

describe("Entity: ProblemReport", () => {
  it("deve criar report com VOs e campos corretos", () => {
    const dates = makeDates();
    const protocol = makeProblemProtocol();
    const attachments = makeProblemAttachments();
    const status = makeProblemStatus();
    const description = makeProblemDescription();
    const type = makeProblemType();

    const report = new ProblemReport(
      1,
      protocol,
      attachments,
      status,
      description,
      type,
      dates.createdAt,
      dates.updatedAt,
      777,
      null,
      null
    );

    expect(report.subscriberId).toBe(777);
    expect(report.resolvedByAdminId).toBeNull();
  });
});
