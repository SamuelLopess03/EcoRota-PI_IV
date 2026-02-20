import { CollectionTime } from "../../../src/domain/value-objects/CollectionTime.js";
import { InvalidCollectionTimeError } from "../../../src/domain/errors/InvalidCollectionTimeError.js";

describe("Value Object: CollectionTime", () => {
  it("deve criar intervalo de tempo válido", () => {
    const time = new CollectionTime("08:00", "12:00");

    expect(time.getStartTime()).toBe("08:00");
    expect(time.getEndTime()).toBe("12:00");
  });

  it("deve formatar intervalo corretamente", () => {
    const time = new CollectionTime("08:00", "12:00");

    expect(time.getFormattedInterval()).toBe("08:00 - 12:00");
  });

  it("deve lançar erro com hora inicial após hora final", () => {
    expect(() => new CollectionTime("12:00", "06:00")).toThrow(InvalidCollectionTimeError);
  });

  it("deve lançar erro com horários iguais", () => {
    expect(() => new CollectionTime("08:00", "08:00")).toThrow(InvalidCollectionTimeError);
  });

  it("deve lançar erro com formato de hora inválido", () => {
    expect(() => new CollectionTime("8:00", "12:00")).toThrow(InvalidCollectionTimeError);
  });

  it("deve lançar erro com hora fora do intervalo (25:00)", () => {
    expect(() => new CollectionTime("25:00", "12:00")).toThrow(InvalidCollectionTimeError);
  });

  it("deve comparar dois intervalos iguais", () => {
    const time1 = new CollectionTime("08:00", "12:00");
    const time2 = new CollectionTime("08:00", "12:00");

    expect(time1.equals(time2)).toBe(true);
  });

  it("deve comparar dois intervalos diferentes", () => {
    const time1 = new CollectionTime("08:00", "12:00");
    const time2 = new CollectionTime("14:00", "18:00");

    expect(time1.equals(time2)).toBe(false);
  });
});
