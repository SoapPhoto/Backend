import { Test, TestingModule } from '@nestjs/testing';
import { LocationResolver } from './location.resolver';

describe('LocationResolver', () => {
  let resolver: LocationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationResolver],
    }).compile();

    resolver = module.get<LocationResolver>(LocationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
