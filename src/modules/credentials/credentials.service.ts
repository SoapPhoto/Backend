import {
  Injectable, Inject, forwardRef, ForbiddenException, UnauthorizedException, BadGatewayException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'nestjs-redis';
import { OauthStateType } from '@common/enum/oauthState';
import { UserService } from '../user/user.service';
import { CredentialsEntity } from './credentials.entity';
import { UserEntity } from '../user/user.entity';
import { AuthorizeDto } from './dto/credentials.dto';

@Injectable()
export class CredentialsService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(CredentialsEntity)
    private credentialsRepository: Repository<CredentialsEntity>,
    private readonly redisService: RedisService,
  ) {}

  public getInfo = async (id: string) => this.credentialsRepository.createQueryBuilder('cr')
    .where('cr.id=:id', { id })
    .leftJoinAndSelect('cr.user', 'user')
    .getOne()

  public async create(data: Partial<CredentialsEntity>) {
    return this.credentialsRepository.save(
      this.credentialsRepository.create(data),
    );
  }

  public async getUserCredentialList(user: UserEntity) {
    return this.credentialsRepository.createQueryBuilder('cr')
      .where('cr.userId=:id', { id: user.id })
      .getMany();
  }

  public async authorize(user: UserEntity, { code }: AuthorizeDto) {
    const redisClient = this.redisService.getClient();
    const strData = await redisClient.get(`oauth.${OauthStateType.authorize}.${code}`);
    if (!strData) {
      throw new UnauthorizedException('code credentials are invalid');
    }
    const { data, type } = JSON.parse(strData);
    const isAuthorize = await Promise.all([
      this.credentialsRepository.createQueryBuilder('cr')
        .where('cr.userId=:id AND cr.type=:type', { id: user.id, type })
        .getOne(),
      this.credentialsRepository.createQueryBuilder('cr')
        .where('cr.id=:id', { id: `${type}_${data.id}` })
        .getOne(),
    ]);
    if (isAuthorize[0]) {
      throw new UnauthorizedException(`authorized ${type}`);
    }
    if (isAuthorize[1]) {
      throw new UnauthorizedException('github account authorized');
    }
    await this.create({
      id: `${type}_${data.id}`,
      type,
      user,
      info: data,
    });
  }

  public async revoke(user: UserEntity, id: string) {
    const data = await this.getInfo(id);
    if (!data || data.user.id !== user.id) {
      throw new ForbiddenException();
    }
    const count = await this.credentialsRepository.createQueryBuilder('cr')
      .where('cr.userId=:id', { id: user.id })
      .getCount();
    if (count === 1 && !user.isPassword) {
      throw new BadGatewayException('reserved login type');
    }
    await this.credentialsRepository.createQueryBuilder()
      .delete()
      .from(CredentialsEntity)
      .where('id=:id', { id })
      .execute();
  }
}
