import {
  Controller, UseGuards, UseFilters, Get, Param, HttpCode, HttpStatus, Delete, Post, Body,
} from '@nestjs/common';

import { AuthGuard } from '@server/common/guard/auth.guard';
import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { Role } from '../user/enum/role.enum';
import { UserEntity } from '../user/user.entity';
import { CredentialsService } from './credentials.service';
import { AuthorizeDto } from './dto/credentials.dto';

@Controller('api/credentials')
@UseGuards(AuthGuard)
@UseFilters(new AllExceptionFilter())
export class CredentialsController {
  constructor(
    private credentialsService: CredentialsService,
  ) {}

  @Get()
  @Roles(Role.USER)
  public getCredentials(
    @User() user: UserEntity,
  ) {
    return this.credentialsService.getUserCredentialList(user);
  }

  @Delete(':id')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async revoke(
    @Param('id') id: string,
    @User() user: UserEntity,
  ) {
    return this.credentialsService.revoke(user, id);
  }

  @Post('authorize')
  @Roles(Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async authorize(
    @Body() data: AuthorizeDto,
    @User() user: UserEntity,
  ) {
    return this.credentialsService.authorize(user, data);
  }
}
