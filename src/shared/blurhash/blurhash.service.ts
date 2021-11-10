import { Injectable } from '@nestjs/common';
import { RedisManager } from '@liaoliaots/nestjs-redis';
import { decode } from 'blurhash';
import { createCanvas, createImageData } from 'canvas';
import { cli } from 'winston/lib/winston/config';
import dayjs from 'dayjs';

@Injectable()
export class BlurhashService {
  constructor(
    private readonly redisManager: RedisManager,
  ) {}

  public async getBase64(hash: string, width: number, height: number) {
    const client = this.redisManager.getClient();
    let base64 = await client.get(hash);
    if (base64) {
      return base64;
    }
    const pixels = decode(hash, width, height);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.putImageData(createImageData(pixels, width, height), 0, 0);
    base64 = canvas.toDataURL();
    await client.set(hash, base64, 'EX', 1209600);
    return base64;
  }
}
