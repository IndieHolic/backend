import { Test, TestingModule } from '@nestjs/testing';
import { AgoraPassService } from './agora-pass.service';

describe('AgoraPassService', () => {
  let service: AgoraPassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgoraPassService],
    }).compile();

    service = module.get<AgoraPassService>(AgoraPassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
