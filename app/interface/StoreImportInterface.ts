import { ProductionInterface } from "./ProductionInterface"
import { StoreInterface } from "./StoreInterface"

export interface StoreImportInterface {
    id: number
    store: StoreInterface
    production: ProductionInterface
    quantity: number
    remark: string
    importDate: string
}