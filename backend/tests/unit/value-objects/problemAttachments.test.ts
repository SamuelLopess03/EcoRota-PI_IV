import { ProblemAttachments } from "../../../src/domain/value-objects/ProblemAttachments.js";

describe("Value Object: ProblemAttachments", () => {
  it("deve criar anexos a partir de array", () => {
    const attachments = new ProblemAttachments(["https://img.com/1.png", "https://img.com/2.png"]);

    expect(attachments.getValues()).toEqual(["https://img.com/1.png", "https://img.com/2.png"]);
    expect(attachments.isEmpty()).toBe(false);
  });

  it("deve criar anexos a partir de string separada por vírgula", () => {
    const attachments = new ProblemAttachments("https://img.com/1.png, https://img.com/2.png");

    expect(attachments.getValues()).toEqual(["https://img.com/1.png", "https://img.com/2.png"]);
  });

  it("deve criar lista vazia a partir de string vazia", () => {
    const attachments = new ProblemAttachments("");

    expect(attachments.isEmpty()).toBe(true);
    expect(attachments.getValues()).toEqual([]);
  });

  it("deve criar lista vazia a partir de array vazio", () => {
    const attachments = new ProblemAttachments([]);

    expect(attachments.isEmpty()).toBe(true);
  });

  it("deve serializar anexos como string", () => {
    const attachments = new ProblemAttachments(["https://img.com/1.png", "https://img.com/2.png"]);

    expect(attachments.serialize()).toBe("https://img.com/1.png,https://img.com/2.png");
  });

  it("deve comparar dois conjuntos de anexos iguais", () => {
    const a1 = new ProblemAttachments(["https://img.com/1.png"]);
    const a2 = new ProblemAttachments(["https://img.com/1.png"]);

    expect(a1.equals(a2)).toBe(true);
  });

  it("deve comparar dois conjuntos de anexos diferentes", () => {
    const a1 = new ProblemAttachments(["https://img.com/1.png"]);
    const a2 = new ProblemAttachments(["https://img.com/2.png"]);

    expect(a1.equals(a2)).toBe(false);
  });
});
