import { Test, TestingModule } from '@nestjs/testing';
import { PictureBadgeActivityService } from './picture-badge-activity.service';

describe('PictureBadgeActivityService', () => {
  let service: PictureBadgeActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PictureBadgeActivityService],
    }).compile();

    service = module.get<PictureBadgeActivityService>(
      PictureBadgeActivityService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
