import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { AddCardDto } from './dto/addCard.dto';
import { ReorderCardDto } from './dto/reorderCard.dto';
import { ActionEnum, ColumnNameEnum } from '@prisma/client';

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCards() {
    const backlogList = await this.prisma.card.findMany({
      where: {
        columnName: ColumnNameEnum.BACKLOG,
      },
      orderBy: {
        order: 'asc',
      },
    });
    const todoList = await this.prisma.card.findMany({
      where: {
        columnName: ColumnNameEnum.TODO,
      },
      orderBy: {
        order: 'asc',
      },
    });
    const doneList = await this.prisma.card.findMany({
      where: {
        columnName: ColumnNameEnum.DONE,
      },
      orderBy: {
        order: 'asc',
      },
    });
    return {
      backlogList,
      todoList,
      doneList,
    };
  }

  async addCard(input: AddCardDto) {
    const { tagId, columnName, ...rest } = input;
    const cardCount = await this.prisma.card.count({
      where: {
        columnName,
      },
    });
    const nextOrderNb = cardCount + 1;
    return this.prisma.card.create({
      data: {
        ...rest,
        tag: {
          connect: {
            id: tagId,
          },
        },
        order: nextOrderNb,
        columnName,
      },
    });
  }

  async reorderCard(input: ReorderCardDto) {
    const {
      id: movedCardId,
      oldOrder: oldIndex,
      order: nextIndex,
      oldColumnName,
      newColumnName,
    } = input;

    if (oldColumnName === newColumnName) {
      const movedCard = await this.prisma.card.findUnique({
        where: {
          id: movedCardId,
        },
      });

      if (!movedCard) {
        throw new NotFoundException('Card not found');
      }

      const oldList = await this.prisma.card.findMany({
        where: {
          columnName: oldColumnName,
          id: {
            not: movedCardId,
          },
        },
        orderBy: {
          order: 'asc',
        },
      });

      const reorderedList = [
        ...oldList.slice(0, nextIndex),
        movedCard,
        ...oldList.slice(nextIndex),
      ];

      const newListTransaction = [];
      reorderedList.map((card, index) => {
        newListTransaction.push(
          this.prisma.card.update({
            where: { id: card.id },
            data: { order: index },
          }),
        );
      });

      await this.prisma.$transaction(newListTransaction);
    } else {
      const movedCard = await this.prisma.card.findUnique({
        where: {
          id: movedCardId,
        },
      });

      if (!movedCard) {
        throw new NotFoundException('Card not found');
      }
      await this.prisma.card.update({
        where: {
          id: movedCardId,
        },
        data: {
          columnName: newColumnName,
        },
      });

      const oldListOldColumn = await this.prisma.card.findMany({
        where: {
          columnName: oldColumnName,
        },
        orderBy: {
          order: 'asc',
        },
      });

      const newListOldColumnTransaction = [];
      oldListOldColumn.map((card, index) => {
        newListOldColumnTransaction.push(
          this.prisma.card.update({
            where: { id: card.id },
            data: { order: index },
          }),
        );
      });

      await this.prisma.$transaction(newListOldColumnTransaction);
      // Updating the new list
      const oldListNewColumn = await this.prisma.card.findMany({
        where: {
          columnName: newColumnName,
          id: {
            not: movedCardId,
          },
        },
        orderBy: {
          order: 'asc',
        },
      });

      const reorderedList = [
        ...oldListNewColumn.slice(0, nextIndex),
        movedCard,
        ...oldListNewColumn.slice(nextIndex),
      ];

      const newListTransaction = [];
      reorderedList.map((card, index) => {
        newListTransaction.push(
          this.prisma.card.update({
            where: { id: card.id },
            data: { order: index },
          }),
        );
      });

      await this.prisma.$transaction(newListTransaction);
    }

    await this.prisma.cardLogs.create({
      data: {
        action:
          oldColumnName == newColumnName
            ? oldIndex < nextIndex
              ? ActionEnum.MOVE_DOWN
              : ActionEnum.MOVE_UP
            : ActionEnum.MOVE_TO,
        toListName:newColumnName,
        Card:{
            connect:{
                id:movedCardId
            }
        }
      },
    });

    return { message: 'Card reordered successfully' };
  }
}
