import { ProblemReport } from "../../../src/domain/entities/ProblemReport.js";
import {
  makeProblemProtocol,
  makeProblemAttachments,
  makeProblemStatus,
  makeProblemDescription,
  makeProblemType,
  makeDates,
} from "../../helpers/valueObjectFactories.js";

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

    expect(report.id).toBe(1);
    expect(report.protocol.getValue()).toBe("PR-2025-0001");
    expect(report.status.getValue()).toBe("PENDING");
    expect(report.description.getValue()).toBe("Lixo espalhado na calçada há dias.");
    expect(report.subscriberId).toBe(777);
    expect(report.resolvedByAdminId).toBeNull();
    expect(report.justification).toBeNull();
  });
});
