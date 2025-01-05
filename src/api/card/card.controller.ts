import { Body, Controller, Get, Post } from '@nestjs/common';
import { CardService } from './card.service';
import { AddCardDto } from './dto/addCard.dto';
import { ReorderCardDto } from './dto/reorderCard.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
  @Get()
  getAllCards(){
    return this.cardService.getAllCards();
  }

  @Post('create')
  async addCard(@Body() input:AddCardDto){
    return await this.cardService.addCard(input);
  }

  @Post('reorder')
  reorderCard(@Body() input: ReorderCardDto) {
    return this.cardService.reorderCard(input);
  }
  
}
