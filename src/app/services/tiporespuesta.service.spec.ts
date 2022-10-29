import { TestBed } from '@angular/core/testing';

import { TiporespuestaService } from './tiporespuesta.service';

describe('TiporespuestaService', () => {
  let service: TiporespuestaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiporespuestaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
