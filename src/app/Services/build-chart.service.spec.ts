import { TestBed } from '@angular/core/testing';

import { BuildChartService } from './build-chart.service';

describe('BuildChartService', () => {
  let service: BuildChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
