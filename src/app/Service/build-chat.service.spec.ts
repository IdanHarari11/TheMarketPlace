import { TestBed } from '@angular/core/testing';

import { BuildChatService } from './build-chat.service';

describe('BuildChatService', () => {
  let service: BuildChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
