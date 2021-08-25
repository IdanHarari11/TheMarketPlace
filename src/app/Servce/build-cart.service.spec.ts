import { TestBed } from '@angular/core/testing';

import { BuildCartService } from './build-cart.service';

describe('BuildCartService', () => {
  let service: BuildCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
