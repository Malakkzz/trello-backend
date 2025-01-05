import { ColumnNameEnum } from "@prisma/client"

export class AddCardDto{
    title:string
    description:string
    tagId:number
    columnName:ColumnNameEnum
}