import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagService } from './tag.service';
import { AddTagDto } from './dto/addTag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  getAllTags(){
    return this.tagService.getAllTags();
  }

  @Post('create')
  async addTag(@Body() input: AddTagDto){
    return await this.tagService.addTag(input);
  }
}
