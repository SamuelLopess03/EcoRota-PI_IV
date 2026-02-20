import { CollectionDays } from "../../../src/domain/value-objects/CollectionDays.js";
import { InvalidCollectionDaysError } from "../../../src/domain/errors/InvalidCollectionDaysError.js";
import { WeekDay } from "../../../src/domain/value-objects/WeekDay.js";

describe("Value Object: CollectionDays", () => {
  it("deve criar dias de coleta válidos", () => {
    const days = new CollectionDays([WeekDay.MONDAY, WeekDay.WEDNESDAY]);

    expect(days.getDays()).toEqual([WeekDay.MONDAY, WeekDay.WEDNESDAY]);
    expect(days.count()).toBe(2);
  });

  it("deve ordenar os dias automaticamente", () => {
    const days = new CollectionDays([WeekDay.FRIDAY, WeekDay.MONDAY]);

    expect(days.getDays()).toEqual([WeekDay.MONDAY, WeekDay.FRIDAY]);
  });

  it("deve remover dias duplicados", () => {
    const days = new CollectionDays([WeekDay.MONDAY, WeekDay.MONDAY, WeekDay.FRIDAY]);

    expect(days.count()).toBe(2);
    expect(days.getDays()).toEqual([WeekDay.MONDAY, WeekDay.FRIDAY]);
  });

  it("deve lançar erro com lista vazia", () => {
    expect(() => new CollectionDays([])).toThrow(InvalidCollectionDaysError);
  });

  it("deve verificar se coleta em um dia específico", () => {
    const days = new CollectionDays([WeekDay.MONDAY, WeekDay.WEDNESDAY]);

    expect(days.hasCollectionOn(WeekDay.MONDAY)).toBe(true);
    expect(days.hasCollectionOn(WeekDay.SUNDAY)).toBe(false);
  });

  it("deve verificar se é todos os dias", () => {
    const everyday = CollectionDays.everyday();

    expect(everyday.isEveryday()).toBe(true);
    expect(everyday.count()).toBe(7);
  });

  it("deve criar apenas dias úteis", () => {
    const weekdays = CollectionDays.weekdaysOnly();

    expect(weekdays.isWeekdaysOnly()).toBe(true);
    expect(weekdays.count()).toBe(5);
    expect(weekdays.hasWeekendCollection()).toBe(false);
  });

  it("deve criar apenas fins de semana", () => {
    const weekends = CollectionDays.weekendsOnly();

    expect(weekends.count()).toBe(2);
    expect(weekends.hasWeekendCollection()).toBe(true);
  });

  it("deve detectar sobreposição entre duas listas", () => {
    const days1 = new CollectionDays([WeekDay.MONDAY, WeekDay.WEDNESDAY]);
    const days2 = new CollectionDays([WeekDay.WEDNESDAY, WeekDay.FRIDAY]);

    expect(days1.hasOverlapWith(days2)).toBe(true);
    expect(days1.getOverlapWith(days2)).toEqual([WeekDay.WEDNESDAY]);
  });

  it("deve comparar duas listas iguais", () => {
    const days1 = new CollectionDays([WeekDay.MONDAY, WeekDay.WEDNESDAY]);
    const days2 = new CollectionDays([WeekDay.MONDAY, WeekDay.WEDNESDAY]);

    expect(days1.equals(days2)).toBe(true);
  });

  it("deve adicionar dias de forma imutável", () => {
    const original = new CollectionDays([WeekDay.MONDAY]);
    const updated = original.addDays(WeekDay.FRIDAY);

    expect(original.count()).toBe(1);
    expect(updated.count()).toBe(2);
  });

  it("deve remover dias de forma imutável", () => {
    const original = new CollectionDays([WeekDay.MONDAY, WeekDay.FRIDAY]);
    const updated = original.removeDays(WeekDay.FRIDAY);

    expect(original.count()).toBe(2);
    expect(updated.count()).toBe(1);
  });

  it("deve criar a partir de string", () => {
    const days = CollectionDays.fromString(`${WeekDay.MONDAY}, ${WeekDay.WEDNESDAY}`);

    expect(days.getDays()).toEqual([WeekDay.MONDAY, WeekDay.WEDNESDAY]);
  });
});
