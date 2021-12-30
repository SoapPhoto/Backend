import {
  Injectable,
  Inject,
  forwardRef,
  ForbiddenException,
  UnauthorizedException,
  BadGatewayException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisManager } from '@liaoliaots/nestjs-redis';
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
    private readonly redisManager: RedisManager
  ) {}

  public getInfo = async (id: string) =>
    this.credentialsRepository
      .createQueryBuilder('cr')
      .where('cr.id=:id', { id })
      .leftJoinAndSelect('cr.user', 'user')
      .getOne();

  public async create(data: Partial<CredentialsEntity>) {
    return this.credentialsRepository.save(
      this.credentialsRepository.create(data)
    );
  }

  public async getUserCredentialList(user: UserEntity) {
    return this.credentialsRepository
      .createQueryBuilder('cr')
      .where('cr.userId=:id', { id: user.id })
      .getMany();
  }

  public async authorize(user: UserEntity, { code }: AuthorizeDto) {
    const redisClient = this.redisManager.getClient();
    const strData = await redisClient.get(
      `oauth:${OauthStateType.authorize}:${code}`
    );
    if (!strData) {
      throw new UnauthorizedException('code_credentials_invalid');
    }
    const { data, type } = JSON.parse(strData);
    const isAuthorize = await Promise.all([
      this.credentialsRepository
        .createQueryBuilder('cr')
        .where('cr.userId=:id AND cr.type=:type', { id: user.id, type })
        .getOne(),
      this.credentialsRepository
        .createQueryBuilder('cr')
        .where('cr.id=:id', { id: `${type}_${data.id}` })
        .getOne(),
    ]);
    if (isAuthorize[0]) {
      throw new UnauthorizedException('authorized');
    }
    if (isAuthorize[1]) {
      throw new UnauthorizedException('authorized');
    }
    await this.create({
      id: `${type}_${data.id ?? data.sub}`,
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
    const count = await this.credentialsRepository
      .createQueryBuilder('cr')
      .where('cr.userId=:id', { id: user.id })
      .getCount();
    if (count === 1 && !user.isPassword) {
      throw new BadGatewayException('reserved_login');
    }
    await this.credentialsRepository
      .createQueryBuilder()
      .delete()
      .from(CredentialsEntity)
      .where('id=:id', { id })
      .execute();
  }
}
