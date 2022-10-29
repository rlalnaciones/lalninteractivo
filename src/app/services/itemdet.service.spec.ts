import { TestBed } from '@angular/core/testing';

import { ItemdetService } from './itemdet.service';

describe('ItemdetService', () => {
  let service: ItemdetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemdetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
