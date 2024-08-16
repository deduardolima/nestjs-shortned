import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UrlsService } from './urls/urls.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AppService {
  constructor(
    private readonly urlsService: UrlsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async getOriginalUrl(shortUrl: string): Promise<string | null> {
    const cachedUrl = await this.cacheManager.get<string>(shortUrl);
    if (cachedUrl) {
      console.log('bateu no cache', cachedUrl)
      return cachedUrl;
    }
    const url = await this.urlsService.findByShortUrl(shortUrl);

    if (url) {
      await this.cacheManager.set(shortUrl, url.originalUrl);
      return url.originalUrl;
    }

    return null;
  };

  async clear(shortUrl: string) {
    await this.cacheManager.del(shortUrl);
  };

  async incrementClicks(shortUrl: string): Promise<void> {
    await this.urlsService.incrementClicks(shortUrl);
  }
}
