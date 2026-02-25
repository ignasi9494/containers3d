export interface ContainerSpec {
  length: number;
  width: number;
  height: number;
  capacity: string;
  weight: number;
  material: string;
}

export type ContainerCategory =
  | "embalajes"
  | "contenedores"
  | "maquinaria";

export interface Container {
  id: string;
  slug: string;
  category: ContainerCategory;
  modelPath: string;
  posterPath: string;
  specs: ContainerSpec;
  nameKey: string;
  descriptionKey: string;
  useCasesKey: string;
}
