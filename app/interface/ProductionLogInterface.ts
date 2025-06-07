import { ProductionInterface } from "./ProductionInterface";

export interface ProductionLogInterface {
    id: number;
    production: ProductionInterface;
    quantity: number;
    unit: string;
    createdAt: Date;
    remark: string;
}