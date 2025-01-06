import { ColumnNameEnum } from "@prisma/client";

export class ReorderCardDto {
    id: number;
    oldOrder:number;
    order: number;
    newColumnName:ColumnNameEnum;
  }
  