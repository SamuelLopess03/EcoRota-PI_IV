import { InvalidProblemAttachmentsError } from "../errors/InvalidProblemAttachmentsError.js";

export class ProblemAttachments {
  private readonly attachments: readonly string[];

  constructor(attachments: string[] | string) {
    if (typeof attachments === "string") {
      this.attachments = Object.freeze(this.parseString(attachments));
    } else {
      this.attachments = Object.freeze([...attachments]);
    }
    this.validate();
  }

  private parseString(attachmentsStr: string): string[] {
    if (!attachmentsStr || attachmentsStr.trim() === "") {
      return [];
    }
    return attachmentsStr.split(",").map(attr => attr.trim()).filter(attr => attr !== "");
  }

  private validate(): void {
    for (const attr of this.attachments) {
      if (attr.trim() === "") {
        throw new InvalidProblemAttachmentsError("Um anexo não pode ser uma string vazia.");
      }
    }
  }

  public getValues(): string[] {
    return [...this.attachments];
  }

  public serialize(): string {
    return this.attachments.join(",");
  }

  public isEmpty(): boolean {
    return this.attachments.length === 0;
  }

  public equals(other: ProblemAttachments): boolean {
    if (!(other instanceof ProblemAttachments)) {
      return false;
    }
    if (this.attachments.length !== other.attachments.length) {
      return false;
    }
    return this.attachments.every((val, index) => val === other.attachments[index]);
  }
}
