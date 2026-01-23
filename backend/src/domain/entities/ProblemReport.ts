import { ProblemAttachments } from "../value-objects/ProblemAttachments.js";
import { ProblemStatus } from "../value-objects/ProblemStatus.js";
import { ProblemDescription } from "../value-objects/ProblemDescription.js";
import { ProblemType } from "../value-objects/ProblemType.js";

export class ProblemReport {
  constructor(
    public readonly id: number,
    public attachments: ProblemAttachments,
    public status: ProblemStatus,
    public description: ProblemDescription,
    public problemType: ProblemType,
    public protocol: string,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public subscriber_id: number,
    public resolved_by_admin_id: number | null
  ) {}
}
