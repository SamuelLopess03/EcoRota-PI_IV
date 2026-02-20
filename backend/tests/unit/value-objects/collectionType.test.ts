import { CollectionType } from "../../../src/domain/value-objects/CollectionType.js";
import { InvalidCollectionTypeError } from "../../../src/domain/errors/InvalidCollectionTypeError.js";

describe("Value Object: CollectionType", () => {
  it.each([
    "Coleta regular",
    "Coleta seletiva",
    "Coleta especial",
    "Coleta agendada",
  ])("deve criar tipo de coleta válido: %s", (type) => {
    const collectionType = new CollectionType(type);

    expect(collectionType.getValue()).toBe(type);
  });

  it("deve lançar erro com tipo inválido", () => {
    expect(() => new CollectionType("coleta invalida")).toThrow(InvalidCollectionTypeError);
  });

  it("deve normalizar espaços extras", () => {
    const type = new CollectionType("  Coleta regular  ");

    expect(type.getValue()).toBe("Coleta regular");
  });

  it("deve comparar dois tipos iguais", () => {
    const type1 = new CollectionType("Coleta seletiva");
    const type2 = new CollectionType("Coleta seletiva");

    expect(type1.equals(type2)).toBe(true);
  });

  it("deve retornar lista de tipos válidos", () => {
    const validTypes = CollectionType.getValidTypes();

    expect(validTypes).toContain("Coleta regular");
    expect(validTypes).toContain("Coleta seletiva");
    expect(validTypes.length).toBe(4);
  });
});
