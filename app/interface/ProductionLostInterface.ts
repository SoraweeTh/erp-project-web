import { ProductionInterface } from "./ProductionInterface"

export interface ProductionLostInterface {
    id: number
    production: ProductionInterface
    quantity: number
    createdAt: Date
    remark: string
}