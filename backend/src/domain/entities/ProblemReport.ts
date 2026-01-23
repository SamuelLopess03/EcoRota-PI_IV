import { ProblemDescription } from "../value-objects/ProblemDescription.js";

export class ProblemReport {
  constructor(
    public readonly id: number,
    public problem_type: string,
    public description: ProblemDescription,
    public status: string,
    public url_attachments: string,
    public protocol: string,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public subscriber_id: number,
    public resolved_by_admin_id: number | null
  ) {}
}
