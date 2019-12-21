import { Test, TestingModule } from '@nestjs/testing';
import { BadgeResolver } from './badge.resolver';

describe('BadgeResolver', () => {
  let resolver: BadgeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgeResolver],
    }).compile();

    resolver = module.get<BadgeResolver>(BadgeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
