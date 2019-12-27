import { Test, TestingModule } from '@nestjs/testing';
import { UserBadgeActivityService } from './user-badge-activity.service';

describe('UserBadgeActivityService', () => {
  let service: UserBadgeActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBadgeActivityService],
    }).compile();

    service = module.get<UserBadgeActivityService>(UserBadgeActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
