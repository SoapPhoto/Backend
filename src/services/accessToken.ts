import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';

import { AccessTokenRepository } from '@repositories/AccessTokenRepository';

@Service()
export class AccessTokenService {
  public accessTokenRepository = getCustomRepository(AccessTokenRepository);

  public delete = this.accessTokenRepository.delete;
}
