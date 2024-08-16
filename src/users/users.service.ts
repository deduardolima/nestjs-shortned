import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.UserCreateInput) {
    try {
      return await this.prisma.user.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new ConflictException('Email está em uso');
          default:
            throw new BadRequestException(error.message);
        }
      }
      throw new InternalServerErrorException(error.message);
    }
  }
  async findByEmail(email: string) {
    try {
      return this.prisma.user.findUnique({ where: { email } });

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }
  async findOne(id: string) {
    try {
      return this.prisma.user.findUnique({ where: { id } });

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }
}
