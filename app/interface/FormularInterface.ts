import { MaterialInterface } from "./MaterialInterface";
import { ProductionInterface } from "./ProductionInterface";

export interface FormularInterface {
    id: number
    name: string
    quantity: number
    unit: string
    material: MaterialInterface
    production: ProductionInterface
}