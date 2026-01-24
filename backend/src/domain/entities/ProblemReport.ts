import { ProblemProtocol } from "../value-objects/ProblemProtocol.js";
import { ProblemAttachments } from "../value-objects/ProblemAttachments.js";
import { ProblemStatus } from "../value-objects/ProblemStatus.js";
import { ProblemDescription } from "../value-objects/ProblemDescription.js";
import { ProblemType } from "../value-objects/ProblemType.js";

export class ProblemReport {
  constructor(
    public readonly id: number,
    public protocol: ProblemProtocol,
    public attachments: ProblemAttachments,
    public status: ProblemStatus,
    public description: ProblemDescription,
    public problemType: ProblemType,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public subscriberId: number,
    public resolvedByAdminId: number | null
  ) { }
}
