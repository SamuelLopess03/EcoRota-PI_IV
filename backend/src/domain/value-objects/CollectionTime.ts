import { InvalidCollectionTimeError } from "../errors/InvalidCollectionTimeError.js";

export class CollectionTime {
  private readonly startTime: string;
  private readonly endTime: string;

  constructor(startTime: string, endTime: string) {
    if (!this.isValidTimeFormat(startTime)) {
      throw new InvalidCollectionTimeError(`Formato inválido para hora inicial: ${startTime}. Use HH:mm`);
    }
    if (!this.isValidTimeFormat(endTime)) {
      throw new InvalidCollectionTimeError(`Formato inválido para hora final: ${endTime}. Use HH:mm`);
    }
    if (!this.isValidInterval(startTime, endTime)) {
      throw new InvalidCollectionTimeError(
        `O horário inicial (${startTime}) deve ser anterior ao horário final (${endTime})`
      );
    }

    this.startTime = startTime;
    this.endTime = endTime;
  }

  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time);
  }

  private isValidInterval(start: string, end: string): boolean {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return endMinutes - startMinutes >= 1;
  }

  public getStartTime(): string {
    return this.startTime;
  }

  public getEndTime(): string {
    return this.endTime;
  }

  public getFormattedInterval(): string {
    return `${this.startTime} - ${this.endTime}`;
  }

  public equals(other: CollectionTime): boolean {
    return this.startTime === other.startTime && this.endTime === other.endTime;
  }
}
