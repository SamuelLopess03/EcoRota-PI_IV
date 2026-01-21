import { InvalidAcceptedMaterialsError } from "../errors/InvalidAcceptedMaterialsError.js";
import { MaterialType, VALID_MATERIALS, MATERIAL_LABELS } from "./MaterialType.js";

export class AcceptedMaterials {
    private readonly materials: ReadonlyArray<MaterialType>;

    constructor(materials: MaterialType[]) {
        this.validate(materials);
        // Remove duplicatas e ordena para garantir consistência
        this.materials = [...new Set(materials)].sort();
    }

    private validate(materials: MaterialType[]): void {
        // Validar se a lista não está vazia
        if (!materials || materials.length === 0) {
            throw new InvalidAcceptedMaterialsError(
                "A lista de materiais aceitos não pode ser vazia"
            );
        }

        // Validar se todos os materiais pertencem ao conjunto permitido
        const invalidMaterials = materials.filter(
            (material) => !VALID_MATERIALS.includes(material)
        );

        if (invalidMaterials.length > 0) {
            throw new InvalidAcceptedMaterialsError(
                `Os seguintes materiais não são permitidos: ${invalidMaterials.join(", ")}`
            );
        }
    }

    /**
     * Retorna a lista de materiais aceitos
     */
    public getMaterials(): ReadonlyArray<MaterialType> {
        return this.materials;
    }

    /**
     * Verifica se um material específico é aceito
     */
    public accepts(material: MaterialType): boolean {
        return this.materials.includes(material);
    }

    /**
     * Retorna a quantidade de tipos de materiais aceitos
     */
    public count(): number {
        return this.materials.length;
    }

    /**
     * Retorna os materiais como string separada por vírgulas (em inglês)
     */
    public toString(): string {
        return this.materials.join(", ");
    }

    /**
     * Retorna os materiais formatados em português
     */
    public toLocalizedString(): string {
        return this.materials
            .map((material) => MATERIAL_LABELS[material])
            .join(", ");
    }

    /**
     * Verifica se aceita todos os materiais de outra lista
     */
    public acceptsAll(other: AcceptedMaterials): boolean {
        return other.materials.every((material) => this.materials.includes(material));
    }

    /**
     * Verifica se aceita pelo menos um material de outra lista
     */
    public acceptsAny(other: AcceptedMaterials): boolean {
        return other.materials.some((material) => this.materials.includes(material));
    }

    /**
     * Compara dois objetos AcceptedMaterials
     * Dois objetos são iguais se aceitam exatamente os mesmos materiais
     */
    public equals(other: AcceptedMaterials): boolean {
        if (!(other instanceof AcceptedMaterials)) {
            return false;
        }

        if (this.materials.length !== other.materials.length) {
            return false;
        }

        // Como ambas as listas estão ordenadas, podemos comparar diretamente
        return this.materials.every(
            (material, index) => material === other.materials[index]
        );
    }

    /**
     * Cria um novo objeto AcceptedMaterials adicionando materiais
     * Mantém a imutabilidade do objeto original
     */
    public addMaterials(...newMaterials: MaterialType[]): AcceptedMaterials {
        const combined = [...this.materials, ...newMaterials];
        return new AcceptedMaterials(combined);
    }

    /**
     * Cria um novo objeto AcceptedMaterials removendo materiais
     * Mantém a imutabilidade do objeto original
     */
    public removeMaterials(...materialsToRemove: MaterialType[]): AcceptedMaterials {
        const filtered = this.materials.filter(
            (material) => !materialsToRemove.includes(material)
        );
        return new AcceptedMaterials(filtered);
    }

    /**
     * Cria um AcceptedMaterials a partir de uma string separada por vírgulas
     * Útil para deserialização do banco de dados
     */
    public static fromString(materialsString: string): AcceptedMaterials {
        const materials = materialsString
            .split(",")
            .map((m) => m.trim() as MaterialType)
            .filter((m) => m.length > 0);

        return new AcceptedMaterials(materials);
    }

    /**
     * Cria um AcceptedMaterials com todos os materiais disponíveis
     */
    public static all(): AcceptedMaterials {
        return new AcceptedMaterials([...VALID_MATERIALS]);
    }
}
