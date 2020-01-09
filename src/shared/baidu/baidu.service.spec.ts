import { Test, TestingModule } from '@nestjs/testing';
import { BaiduService } from './baidu.service';

describe('BaiduService', () => {
  let service: BaiduService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaiduService],
    }).compile();

    service = module.get<BaiduService>(BaiduService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
