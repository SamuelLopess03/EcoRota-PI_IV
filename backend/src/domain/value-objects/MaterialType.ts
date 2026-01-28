/**
 * Enum que define os tipos de materiais recicláveis aceitos pelos Ecopoints
 */
export enum MaterialType {
    GLASS = "glass",
    PLASTIC = "plastic",
    PAPER = "paper",
    METAL = "metal",
    BATTERIES = "batteries",
    ORGANIC = "organic",
    ELECTRONICS = "electronics",
}

/**
 * Array com todos os valores válidos de MaterialType
 * Útil para validações e iterações
 */
export const VALID_MATERIALS = Object.values(MaterialType);

/**
 * Labels em português para cada tipo de material
 * Útil para exibição na interface do usuário
 */
export const MATERIAL_LABELS: Record<MaterialType, string> = {
    [MaterialType.GLASS]: "Vidro",
    [MaterialType.PLASTIC]: "Plástico",
    [MaterialType.PAPER]: "Papel",
    [MaterialType.METAL]: "Metal",
    [MaterialType.BATTERIES]: "Baterias",
    [MaterialType.ORGANIC]: "Orgânico",
    [MaterialType.ELECTRONICS]: "Eletrônicos",
};
