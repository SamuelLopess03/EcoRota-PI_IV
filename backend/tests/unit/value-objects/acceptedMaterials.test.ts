import { AcceptedMaterials } from "../../../src/domain/value-objects/AcceptedMaterials.js";
import { InvalidAcceptedMaterialsError } from "../../../src/domain/errors/InvalidAcceptedMaterialsError.js";
import { MaterialType } from "../../../src/domain/value-objects/MaterialType.js";

describe("Value Object: AcceptedMaterials", () => {
  it("deve criar lista de materiais válida", () => {
    const materials = new AcceptedMaterials([MaterialType.PLASTIC, MaterialType.PAPER]);

    expect(materials.getMaterials()).toContain(MaterialType.PLASTIC);
    expect(materials.getMaterials()).toContain(MaterialType.PAPER);
    expect(materials.count()).toBe(2);
  });

  it("deve remover materiais duplicados", () => {
    const materials = new AcceptedMaterials([MaterialType.PLASTIC, MaterialType.PLASTIC]);

    expect(materials.count()).toBe(1);
  });

  it("deve lançar erro com lista vazia", () => {
    expect(() => new AcceptedMaterials([])).toThrow(InvalidAcceptedMaterialsError);
  });

  it("deve verificar se aceita um material específico", () => {
    const materials = new AcceptedMaterials([MaterialType.PLASTIC, MaterialType.PAPER]);

    expect(materials.accepts(MaterialType.PLASTIC)).toBe(true);
    expect(materials.accepts(MaterialType.GLASS)).toBe(false);
  });

  it("deve criar a partir de string", () => {
    const materials = AcceptedMaterials.fromString(`${MaterialType.PLASTIC}, ${MaterialType.PAPER}`);

    expect(materials.count()).toBe(2);
  });

  it("deve criar com todos os materiais disponíveis", () => {
    const all = AcceptedMaterials.all();

    expect(all.count()).toBeGreaterThan(0);
  });

  it("deve adicionar materiais de forma imutável", () => {
    const original = new AcceptedMaterials([MaterialType.PLASTIC]);
    const updated = original.addMaterials(MaterialType.PAPER);

    expect(original.count()).toBe(1);
    expect(updated.count()).toBe(2);
  });

  it("deve remover materiais de forma imutável", () => {
    const original = new AcceptedMaterials([MaterialType.PLASTIC, MaterialType.PAPER]);
    const updated = original.removeMaterials(MaterialType.PAPER);

    expect(original.count()).toBe(2);
    expect(updated.count()).toBe(1);
  });

  it("deve comparar duas listas iguais", () => {
    const m1 = new AcceptedMaterials([MaterialType.PLASTIC, MaterialType.PAPER]);
    const m2 = new AcceptedMaterials([MaterialType.PLASTIC, MaterialType.PAPER]);

    expect(m1.equals(m2)).toBe(true);
  });
});
