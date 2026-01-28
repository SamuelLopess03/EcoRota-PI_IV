import { RouteRepository } from "../../../domain/repositories/RouteRepository.js";
import { UpdateRouteInputDTO, UpdateRouteOutputDTO } from "../../dtos/route/UpdateRouteDTO.js";
import { CollectionDays } from "../../../domain/value-objects/CollectionDays.js";
import { CollectionTime } from "../../../domain/value-objects/CollectionTime.js";
import { CollectionType } from "../../../domain/value-objects/CollectionType.js";
import { WeekDay } from "../../../domain/value-objects/WeekDay.js";

/**
 * @class UpdateRouteUseCase
 * @description Caso de uso responsável por atualizar os dados de uma rota.
 */
export class UpdateRouteUseCase {
  constructor(private routeRepository: RouteRepository) { }

  /**
   * Executa a atualização da rota.
   * @param id ID da rota.
   * @param input Dados a serem alterados.
   * @returns DTO com os dados atualizados.
   * @throws {EntityNotFoundError} Se a rota não existir.
   * @throws {InvalidCollectionDaysError} Se os dias de coleta forem inválidos.
   * @throws {InvalidCollectionTimeError} Se os horários de coleta forem inválidos.
   * @throws {InvalidCollectionTypeError} Se o tipo de coleta for inválido.
   * @throws {PersistenceError} Se ocorrer uma falha na persistência.
   */
  async execute(id: number, input: UpdateRouteInputDTO): Promise<UpdateRouteOutputDTO> {
    const currentRoute = await this.routeRepository.findById(id);

    const updateData: any = {
      adminIdUpdated: input.adminId
    };

    if (input.name) updateData.name = input.name;
    
    if (input.collectionDays) {
      updateData.collectionDays = new CollectionDays(input.collectionDays as WeekDay[]);
    }

    if (input.startTime !== undefined || input.endTime !== undefined) {
      const start = input.startTime ?? currentRoute.collectionTime.getStartTime();
      const end = input.endTime ?? currentRoute.collectionTime.getEndTime();
      updateData.collectionTime = new CollectionTime(start, end);
    }

    if (input.collectionType) {
      updateData.collectionType = new CollectionType(input.collectionType);
    }

    const updatedRoute = await this.routeRepository.update(id, updateData);

    return {
      id: updatedRoute.id,
      name: updatedRoute.name,
      collectionDays: updatedRoute.collectionDays.getDays() as string[],
      collectionDaysLocalized: updatedRoute.collectionDays.toLocalizedString(),
      startTime: updatedRoute.collectionTime.getStartTime(),
      endTime: updatedRoute.collectionTime.getEndTime(),
      collectionType: updatedRoute.collectionType.getValue(),
      createdAt: updatedRoute.createdAt,
      updatedAt: updatedRoute.updatedAt,
      adminIdCreated: updatedRoute.adminIdCreated,
      adminIdUpdated: updatedRoute.adminIdUpdated
    };
  }
}
