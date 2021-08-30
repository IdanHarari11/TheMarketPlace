import { TestBed } from '@angular/core/testing';

import { GetApiInfoService } from './get-api-info.service';

describe('GetApiInfoService', () => {
  let service: GetApiInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetApiInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
