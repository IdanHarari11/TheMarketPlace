import { TestBed } from '@angular/core/testing';
import { StockDetails } from '../models/stock-details';

import { GetApiInfoService } from './get-api-info.service';

describe('GetApiInfoService', () => {
  let service: GetApiInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[GetApiInfoService]
    });
    service = TestBed.inject(GetApiInfoService);
  });

});

  
