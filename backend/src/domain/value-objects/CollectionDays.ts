import { InvalidCollectionDaysError } from "../errors/InvalidCollectionDaysError.js";
import {
    WeekDay,
    VALID_WEEKDAYS,
    WEEKDAY_LABELS,
    WEEKDAY_SHORT_LABELS,
    WEEKDAY_ORDER,
} from "./WeekDay.js";

export class CollectionDays {
    private readonly days: ReadonlyArray<WeekDay>;

    constructor(days: WeekDay[]) {
        this.validate(days);
        // Remove duplicatas e ordena por dia da semana
        const uniqueDays = [...new Set(days)];
        this.days = uniqueDays.sort((a, b) => WEEKDAY_ORDER[a] - WEEKDAY_ORDER[b]);
    }

    private validate(days: WeekDay[]): void {
        // Validar se a lista não está vazia
        if (!days || days.length === 0) {
            throw new InvalidCollectionDaysError(
                "Deve haver pelo menos um dia de coleta"
            );
        }

        // Validar se todos os dias pertencem ao conjunto permitido
        const invalidDays = days.filter((day) => !VALID_WEEKDAYS.includes(day));

        if (invalidDays.length > 0) {
            throw new InvalidCollectionDaysError(
                `Os seguintes dias não são válidos: ${invalidDays.join(", ")}`
            );
        }
    }

    /**
     * Retorna a lista de dias de coleta
     */
    public getDays(): ReadonlyArray<WeekDay> {
        return this.days;
    }

    /**
     * Verifica se coleta em um dia específico
     */
    public hasCollectionOn(day: WeekDay): boolean {
        return this.days.includes(day);
    }

    /**
     * Retorna a quantidade de dias de coleta
     */
    public count(): number {
        return this.days.length;
    }

    /**
     * Verifica se coleta todos os dias da semana
     */
    public isEveryday(): boolean {
        return this.days.length === 7;
    }

    /**
     * Verifica se coleta apenas em dias úteis (segunda a sexta)
     */
    public isWeekdaysOnly(): boolean {
        const weekdays = [
            WeekDay.MONDAY,
            WeekDay.TUESDAY,
            WeekDay.WEDNESDAY,
            WeekDay.THURSDAY,
            WeekDay.FRIDAY,
        ];
        return (
            this.days.length === 5 &&
            this.days.every((day) => weekdays.includes(day))
        );
    }

    /**
     * Verifica se coleta em fins de semana
     */
    public hasWeekendCollection(): boolean {
        return (
            this.days.includes(WeekDay.SATURDAY) || this.days.includes(WeekDay.SUNDAY)
        );
    }

    /**
     * Retorna os dias como string separada por vírgulas (em inglês)
     */
    public toString(): string {
        return this.days.join(", ");
    }

    /**
     * Retorna os dias formatados em português
     */
    public toLocalizedString(): string {
        return this.days.map((day) => WEEKDAY_LABELS[day]).join(", ");
    }

    /**
     * Retorna os dias formatados em português (abreviado)
     */
    public toShortLocalizedString(): string {
        return this.days.map((day) => WEEKDAY_SHORT_LABELS[day]).join(", ");
    }

    /**
     * Verifica se há sobreposição de dias com outra lista
     */
    public hasOverlapWith(other: CollectionDays): boolean {
        return this.days.some((day) => other.days.includes(day));
    }

    /**
     * Retorna os dias em comum com outra lista
     */
    public getOverlapWith(other: CollectionDays): WeekDay[] {
        return this.days.filter((day) => other.days.includes(day));
    }

    /**
     * Verifica se contém todos os dias de outra lista
     */
    public containsAll(other: CollectionDays): boolean {
        return other.days.every((day) => this.days.includes(day));
    }

    /**
     * Compara dois objetos CollectionDays
     * Dois objetos são iguais se possuem exatamente os mesmos dias
     */
    public equals(other: CollectionDays): boolean {
        if (!(other instanceof CollectionDays)) {
            return false;
        }

        if (this.days.length !== other.days.length) {
            return false;
        }

        // Como ambas as listas estão ordenadas, podemos comparar diretamente
        return this.days.every((day, index) => day === other.days[index]);
    }

    /**
     * Cria um novo objeto CollectionDays adicionando dias
     * Mantém a imutabilidade do objeto original
     */
    public addDays(...newDays: WeekDay[]): CollectionDays {
        const combined = [...this.days, ...newDays];
        return new CollectionDays(combined);
    }

    /**
     * Cria um novo objeto CollectionDays removendo dias
     * Mantém a imutabilidade do objeto original
     */
    public removeDays(...daysToRemove: WeekDay[]): CollectionDays {
        const filtered = this.days.filter((day) => !daysToRemove.includes(day));
        return new CollectionDays(filtered);
    }

    /**
     * Cria um CollectionDays a partir de uma string separada por vírgulas
     * Útil para deserialização do banco de dados
     */
    public static fromString(daysString: string): CollectionDays {
        const days = daysString
            .split(",")
            .map((d) => d.trim() as WeekDay)
            .filter((d) => d.length > 0);

        return new CollectionDays(days);
    }

    /**
     * Cria um CollectionDays com todos os dias da semana
     */
    public static everyday(): CollectionDays {
        return new CollectionDays([...VALID_WEEKDAYS]);
    }

    /**
     * Cria um CollectionDays apenas com dias úteis (segunda a sexta)
     */
    public static weekdaysOnly(): CollectionDays {
        return new CollectionDays([
            WeekDay.MONDAY,
            WeekDay.TUESDAY,
            WeekDay.WEDNESDAY,
            WeekDay.THURSDAY,
            WeekDay.FRIDAY,
        ]);
    }

    /**
     * Cria um CollectionDays apenas com fins de semana
     */
    public static weekendsOnly(): CollectionDays {
        return new CollectionDays([WeekDay.SATURDAY, WeekDay.SUNDAY]);
    }
}
