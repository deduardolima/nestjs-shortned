import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Url, User } from '@prisma/client';
import { UrlResponseDto, UrlWithOwnerResponseDto } from './dto/create-url.dto';

@Injectable()
export class UrlsService {
  constructor(private prisma: PrismaService) { }

  async create(originalUrl: string, userId?: string) {
    const shortUrl = await this.generatorShortcut();

    return this.prisma.$transaction(async (prisma) => {
      try {
        console.log('Data to be saved:', { originalUrl, shortUrl, ownerId: userId });
        const createdUrl = await prisma.url.create({
          data: {
            originalUrl,
            shortUrl,
            ownerId: userId,
          },
          include: {
            owner: true,
          },
        });

        console.log(createdUrl)

        return this.toUrlResponseDto(createdUrl)
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new BadRequestException(error.message);
        }
        throw new BadRequestException(error.message);
      }
    });
  }


  async findByShortUrl(shortUrl: string) {
    try {
      const short = this.prisma.url.findUnique({ where: { shortUrl } });
      if (!short) {
        throw new NotFoundException(`shortcut com string ${shortUrl} não encontrada`);
      }
      return short

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  async incrementClicks(shortUrl: string) {
    try {
      return this.prisma.url.update({
        where: { shortUrl },
        data: { clicks: { increment: 1 } },
      });

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error.message);

    }
  };
  async findUserUrls(userId: string): Promise<UrlResponseDto[]> {
    try {
      const urlFromDB = this.prisma.url.findMany({ where: { ownerId: userId } });
      if (!urlFromDB) {
        throw new NotFoundException(`Urls do userID ${userId} não encontradas`);
      }
      return urlFromDB
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  async updateUrl(id: string, originalUrl: string, userId: string): Promise<Url> {
    try {

    } catch (error) {

    }
    const url = await this.prisma.url.findUnique({ where: { id } });

    if (!url || url.ownerId !== userId) {
      throw new NotFoundException('URL não encontrada ou você não tem permissão para atualizá-la');
    }
    try {
      return this.prisma.url.update({
        where: { id },
        data: { originalUrl, updatedAt: new Date() },
      });

    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }


  async deleteUrl(id: string, userId: string): Promise<void> {
    const url = await this.prisma.url.findUnique({ where: { id } });

    if (!url || url.ownerId !== userId) {
      throw new NotFoundException('URL não encontrada ou você não tem permissão para deletá-la');
    }

    try {
      await this.prisma.url.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }



  private async generatorShortcut(): Promise<string> {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const maxAttemptsPerLength = 15;
    let length = 6;
    const minLength = 2;
    let attempts = 0;

    try {
      while (length >= minLength) {
        const shorty = Array.from({ length }, () => caracteres[Math.floor(Math.random() * caracteres.length)]).join('');
        const existingShorty = await this.findByShortUrl(shorty);

        if (!existingShorty) {
          return shorty;
        }
        attempts++;
        if (attempts >= maxAttemptsPerLength) {
          attempts = 0;
          length--;
        }
      }

      throw new ConflictException('Erro ao gerar shorty aleatório, tente novamente');
    } catch (error) {
      console.error('Erro durante a geração do shorty:', error.message);
      throw new InternalServerErrorException('Erro durante o processo de geração do shorty');
    }
  }
  private toUrlResponseDto(url: Url & { owner?: User }): UrlWithOwnerResponseDto {
    return {
      id: url.id,
      originalUrl: url.originalUrl,
      shortUrl: `${process.env.BASE_URL}/${url.shortUrl}`,
      owner: url.owner ? {
        id: url.owner.id,
        email: url.owner.email,
      } : null,
    };
  }





}
