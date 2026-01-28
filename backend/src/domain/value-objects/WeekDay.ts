/**
 * Enum que define os dias da semana
 */
export enum WeekDay {
    MONDAY = "monday",
    TUESDAY = "tuesday",
    WEDNESDAY = "wednesday",
    THURSDAY = "thursday",
    FRIDAY = "friday",
    SATURDAY = "saturday",
    SUNDAY = "sunday",
}

/**
 * Array com todos os valores válidos de WeekDay
 * Útil para validações e iterações
 */
export const VALID_WEEKDAYS = Object.values(WeekDay);

/**
 * Labels em português para cada dia da semana
 * Útil para exibição na interface do usuário
 */
export const WEEKDAY_LABELS: Record<WeekDay, string> = {
    [WeekDay.MONDAY]: "Segunda-feira",
    [WeekDay.TUESDAY]: "Terça-feira",
    [WeekDay.WEDNESDAY]: "Quarta-feira",
    [WeekDay.THURSDAY]: "Quinta-feira",
    [WeekDay.FRIDAY]: "Sexta-feira",
    [WeekDay.SATURDAY]: "Sábado",
    [WeekDay.SUNDAY]: "Domingo",
};

/**
 * Labels abreviados em português
 */
export const WEEKDAY_SHORT_LABELS: Record<WeekDay, string> = {
    [WeekDay.MONDAY]: "Seg",
    [WeekDay.TUESDAY]: "Ter",
    [WeekDay.WEDNESDAY]: "Qua",
    [WeekDay.THURSDAY]: "Qui",
    [WeekDay.FRIDAY]: "Sex",
    [WeekDay.SATURDAY]: "Sáb",
    [WeekDay.SUNDAY]: "Dom",
};

/**
 * Ordem dos dias da semana (útil para ordenação)
 */
export const WEEKDAY_ORDER: Record<WeekDay, number> = {
    [WeekDay.MONDAY]: 1,
    [WeekDay.TUESDAY]: 2,
    [WeekDay.WEDNESDAY]: 3,
    [WeekDay.THURSDAY]: 4,
    [WeekDay.FRIDAY]: 5,
    [WeekDay.SATURDAY]: 6,
    [WeekDay.SUNDAY]: 7,
};
