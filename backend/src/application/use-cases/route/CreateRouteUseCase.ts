import { RouteRepository } from "../../../domain/repositories/RouteRepository.js";
import { CreateRouteInputDTO, CreateRouteOutputDTO } from "../../dtos/route/CreateRouteDTO.js";
import { CollectionDays } from "../../../domain/value-objects/CollectionDays.js";
import { CollectionTime } from "../../../domain/value-objects/CollectionTime.js";
import { CollectionType } from "../../../domain/value-objects/CollectionType.js";
import { WeekDay } from "../../../domain/value-objects/WeekDay.js";

/**
 * @class CreateRouteUseCase
 * @description Caso de uso responsável pelo cadastro de novas rotas de coleta.
 */
export class CreateRouteUseCase {
  constructor(private routeRepository: RouteRepository) { }

  /**
   * Executa a criação da rota.
   * @param input Dados da nova rota.
   * @returns DTO com os dados da rota criada.
   * @throws {ConflictError} Se o nome da rota já existir.
   * @throws {InvalidCollectionDaysError} Se os dias forem inválidos.
   * @throws {InvalidCollectionTimeError} Se o horário for inválido.
   * @throws {InvalidCollectionTypeError} Se o tipo de coleta for inválido.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(input: CreateRouteInputDTO): Promise<CreateRouteOutputDTO> {
    const collectionDays = new CollectionDays(input.collectionDays as WeekDay[]);
    const collectionTime = new CollectionTime(input.startTime, input.endTime);
    const collectionType = new CollectionType(input.collectionType);

    const route = await this.routeRepository.create({
      name: input.name,
      collectionDays,
      collectionTime,
      collectionType,
      adminIdCreated: input.adminId,
      adminIdUpdated: null
    });

    return {
      id: route.id,
      name: route.name,
      collectionDays: route.collectionDays.getDays() as string[],
      collectionDaysLocalized: route.collectionDays.toLocalizedString(),
      startTime: route.collectionTime.getStartTime(),
      endTime: route.collectionTime.getEndTime(),
      collectionType: route.collectionType.getValue(),
      createdAt: route.createdAt,
      updatedAt: route.updatedAt,
      adminIdCreated: route.adminIdCreated,
      adminIdUpdated: route.adminIdUpdated
    };
  }
}
