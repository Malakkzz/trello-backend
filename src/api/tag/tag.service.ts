import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { AddTagDto } from './dto/addTag.dto';

@Injectable()
export class TagService {
    constructor(private readonly prisma: PrismaService) {}

    getAllTags(){
        return this.prisma.tag.findMany({
            select:{
                id:true,
                name:true,
                color:true,
            }
        });
    }

    async addTag(input:AddTagDto){
        const {name,color}=input;
        const existedcolor=await this.prisma.tag.findFirst({
            where:{color}
        })
        if(existedcolor){
            throw new ConflictException("color already exists")
        }
        await this.prisma.tag.create({
            data:{
                name,
                color
            }
        })
        return {message:"color created successfully"}
    }

}
