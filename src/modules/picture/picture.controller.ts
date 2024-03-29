import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { RedisManager } from '@liaoliaots/nestjs-redis';
import dayjs from 'dayjs';
import request from 'request';
import { Image, createCanvas } from 'canvas';

import { CommentService } from '@server/modules/comment/comment.service';
import { GetPictureCommentListDto } from '@server/modules/comment/dto/comment.dto';
import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { QiniuService } from '@server/shared/qiniu/qiniu.service';
import { Role } from '@server/modules/user/enum/role.enum';
import { UserEntity } from '@server/modules/user/user.entity';
import { keyword } from '@server/common/utils/keyword';
import { BaiduService } from '@server/shared/baidu/baidu.service';
import { encode } from 'blurhash';
import { plainToClass } from 'class-transformer';
import { BaiduClassify } from '@server/shared/baidu/interface/baidu.interface';
import {
  CreatePictureAddDot,
  GetPictureListDto,
  UpdatePictureDot,
} from './dto/picture.dto';
import { PictureService } from './picture.service';
import { FileService } from '../file/file.service';
import { LocationService } from '../location/location.service';
import { LocationEntity } from '../location/location.entity';

@Controller('api/picture')
@UseGuards(AuthGuard)
@UseFilters(new AllExceptionFilter())
export class PictureController {
  constructor(
    private readonly commentService: CommentService,
    private readonly pictureService: PictureService,
    private readonly fileService: FileService,
    private readonly redisManager: RedisManager,
    private readonly baiduService: BaiduService,
    private readonly locationService: LocationService
  ) {}

  @Post()
  @Roles(Role.USER)
  public async upload(
    @Body() body: CreatePictureAddDot,
    @User() user: UserEntity
  ) {
    const { info, tags = [], ...restInfo } = body;
    const file = await this.fileService.getOne(body.key);
    if (file) {
      let location: LocationEntity | undefined;
      if (restInfo.location) {
        location = await this.locationService.getOneOrCreate(
          restInfo.location.uid
        );
      }
      const [, picture] = await Promise.all([
        this.fileService.activated(body.key),
        this.pictureService.create({
          ...info,
          ...restInfo,
          tags,
          user,
          location,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          key: file.key,
          hash: file.hash,
        }),
      ]);
      await this.fileService.bindPicture(body.key, picture);
      return picture;
    }
    throw new BadRequestException('no file');
  }

  @Delete(':id')
  @Roles(Role.USER)
  public async deletePicture(
    @Param('id') id: number,
    @User() user: UserEntity
  ) {
    return this.pictureService.delete(id, user);
  }

  @Put(':id')
  @Roles(Role.USER)
  public async updatePicture(
    @Param('id') id: number,
    @Body() data: UpdatePictureDot,
    @User() user: UserEntity
  ) {
    return this.pictureService.update(id, data, user);
  }

  @Get()
  public async getList(
    @User() user: Maybe<UserEntity>,
    @Query() query: GetPictureListDto
  ) {
    // return this.pictureService.find(user,  query);
  }

  @Post('imageClassify')
  @Roles(Role.USER)
  public async getImageClassify(@Body() { image }: { image: string }) {
    if (image) {
      return this.baiduService.getImageClassify(image);
    }
    return [];
    // Axios.post('https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general');
    // console.log(data);
  }

  @Get(':id([0-9]+)')
  public async getOne(@Param('id') id: string, @User() user: UserEntity) {
    return this.pictureService.findOne(Number(id), user, true);
  }

  @Put('like/:id([0-9]+)')
  @Roles(Role.USER)
  public async likePicture(@Param('id') id: string, @User() user: UserEntity) {
    return this.pictureService.likePicture(Number(id), user, true);
  }

  @Put('unlike/:id([0-9]+)')
  @Roles(Role.USER)
  public async unlikePicture(
    @Param('id') id: string,
    @User() user: UserEntity
  ) {
    return this.pictureService.likePicture(Number(id), user, false);
  }

  @Get(':id([0-9]+)/comments')
  public async getPictureCommentList(
    @Param('id') id: string,
    @User() user: Maybe<UserEntity>,
    @Query() query: GetPictureCommentListDto
  ) {
    return this.commentService.getPictureList(id, query, user);
  }

  @Get('baidu/token')
  @Roles(Role.USER)
  public async getBaiduToken() {
    return this.baiduService.getAccountToken();
  }

  @Get('getHot')
  @Roles(Role.OWNER)
  public async createPictureComment(@User() user: UserEntity) {
    if (user.username !== 'yiiu') throw new ForbiddenException();
    const redisClient = this.redisManager.getClient();
    const data = await this.pictureService.calculateHotPictures();
    await redisClient.zadd('picture_hot', ...data);
    console.log(dayjs().format(), 'picture hot OK!!!!!!!!');
    return { message: 'ok' };
  }

  @Get('getPicture')
  @Roles(Role.OWNER)
  public async getPicture(@User() user: UserEntity) {
    const list = await this.pictureService.getAllPicture();
    const data = list.filter((v) => !v.blurhash);
    await Promise.all(
      data.map(
        (v) =>
          new Promise((resolve) => {
            const hash = v.key;
            const src = `https://cdn.soapphoto.com/${hash}-pictureSmall`;
            const options = {
              url: src,
              encoding: null,
            };
            let sr = 1;
            let width = 600;
            let height = 600;
            if (v.width > v.height) {
              sr = 600 / v.width;
              height = Math.round(v.height * sr);
            } else {
              sr = 600 / v.height;
              width = Math.round(v.width * sr);
            }
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');
            request(options, async (err, res, buffer) => {
              const img = new Image();
              img.onload = () => ctx.drawImage(img, 0, 0);
              img.onerror = (error) => {
                throw error;
              };
              img.src = buffer;
              const blurhash = encode(
                ctx.getImageData(0, 0, width, height).data,
                width,
                height,
                3,
                2
              );
              if (blurhash) {
                await this.pictureService.updateRaw(v, {
                  blurhash,
                });
                console.log('👌', hash);
                resolve(null);
              }
            });
          })
      )
    );
    return data;
  }

  @Get('all/keywords')
  @Roles(Role.OWNER)
  public async setKeywords(@User() user: UserEntity) {
    const list = await this.pictureService.getRawList();
    await Promise.all(
      list.map(async (item) => {
        const keywords = keyword([item.title, item.bio]);
        keywords.unshift(...item.tags.map((tag) => tag.name));
        item.keywords = [...new Set(keywords)].join('|');
        return this.pictureService.updateRaw(item, {
          keywords: [...new Set(keywords)].join('|'),
        });
      })
    );
    return { message: 'ok' };
  }

  @Get('all/classify')
  @Roles(Role.OWNER)
  public async allClassify() {
    const list = await this.pictureService.getNotClassifyPicture();
    const result = await Promise.all(
      list.map(async (e) => {
        let key = `https://cdn-oss.soapphoto.com/photo/${e.key}@!medium`;
        if (/^photo\//.test(e.key)) {
          key = `https://cdn-oss.soapphoto.com/${e.key}@!medium`;
        }
        try {
          const classify = await this.baiduService.getImageClassify(key, true);
          if (classify) {
            await this.pictureService.updateClassifyPicture(
              e.id,
              plainToClass(BaiduClassify, classify)
            );
            return { url: key, id: e.id, classify };
          }
          return false;
        } catch (err) {
          return {
            id: e.id,
            url: key,
            message: err,
          };
        }
        // return this.baiduService.getImageClassify(key, true);
      })
    );
    return result;
    // await Promise.all(
    //   list.map(async (item) => {
    //     const keywords = keyword([item.title, item.bio]);
    //     keywords.unshift(...item.tags.map(tag => tag.name));
    //     item.keywords = [...new Set(keywords)].join('|');
    //     return this.pictureService.updateRaw(item, {
    //       keywords: [...new Set(keywords)].join('|'),
    //     });
    //   }),
    // );
  }

  @Get('update/keywords')
  @Roles(Role.OWNER)
  public async updateKeywords() {
    const list = await this.pictureService.getAllPicture();
    await Promise.all(
      list.map(async (picture) => {
        this.pictureService.updateRaw(picture, {
          keywords: this.pictureService.getPictureKeyword(picture),
        });
        return true;
      })
    );
    return {
      message: 'ok',
      total: list.length,
    };
  }
}
