import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ShortUrl')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
    const originalUrl = await this.appService.getOriginalUrl(shortUrl);
    if (originalUrl) {
      await this.appService.incrementClicks(shortUrl);
      return res.status(301).redirect(originalUrl);
    }
    return res.status(404).send('URL não encontrada');
  }

  @Get('cache/:shortUrl')
  async clearCache(@Param('shortUrl') shortUrl: string) {
    await this.appService.clear(shortUrl)
    return `Cache shorty ${shortUrl} foi limpo`
  };
}
