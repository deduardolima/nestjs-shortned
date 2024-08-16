import { Controller, Post, Body, Get, Param, Res, UseGuards, Request, Delete, Patch } from '@nestjs/common';
import { OptionalAuthGuard } from 'src/auth/guards/optional-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUrlDto, UrlResponseDto, UrlWithOwnerResponseDto } from './dto/create-url.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiCommonResponses } from 'src/error/api.response';
import { UrlsService } from './urls.service';
import { UpdateUrlDto } from './dto/update-url.dto';

@ApiTags('Urls')
@Controller('urls')
export class UrlsController {
  constructor(private urlsService: UrlsService) { }

  @Post()
  @UseGuards(OptionalAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Criação de url encurtada', description: 'Endpoint para criar nova url encurtada' })
  @ApiOkResponse({ description: 'Url encurtada com sucesso', type: UrlWithOwnerResponseDto })
  async create(@Body() createUrlDto: CreateUrlDto, @Request() req) {
    const userId = req.user ? req.user.userId : null;
    console.log(userId)
    return this.urlsService.create(createUrlDto.originalUrl, userId);
  }


  @Get('user')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Pega todas Urls encurtadas do próprio usuário', description: 'Endpoint para todas Urls encurtadas do próprio usuário com usuário autenticado via Bearer Token' })
  @ApiOkResponse({ description: 'Urls encotradas com sucesso', type: UrlResponseDto })
  async getUserUrls(@Request() req) {
    return this.urlsService.findUserUrls(req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Atualizar URL original' })
  @ApiOkResponse({ description: 'URL atualizada com sucesso', type: UrlResponseDto })
  async updateUrl(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto, @Request() req) {
    return this.urlsService.updateUrl(id, updateUrlDto.originalUrl, req.user.userId);
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCommonResponses()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Deletar URL encurtada' })
  @ApiOkResponse({ description: 'URL deletada com sucesso' })
  async deleteUrl(@Param('id') id: string, @Request() req) {
    await this.urlsService.deleteUrl(id, req.user.userId);
    return { message: 'URL deletada com sucesso' };
  }

}
