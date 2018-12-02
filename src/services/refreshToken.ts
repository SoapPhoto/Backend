import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';

import { RefreshTokenRepository } from '@repositories/RefreshTokenRepository';

@Service()
export class RefreshTokenService {
  public refreshTokenRepository = getCustomRepository(RefreshTokenRepository);

  public delete = this.refreshTokenRepository.delete;
}
