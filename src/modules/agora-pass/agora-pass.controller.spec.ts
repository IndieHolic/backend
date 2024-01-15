import { Test, TestingModule } from '@nestjs/testing';
import { AgoraPassController } from './agora-pass.controller';

describe('AgoraPassController', () => {
  let controller: AgoraPassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgoraPassController],
    }).compile();

    controller = module.get<AgoraPassController>(AgoraPassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
