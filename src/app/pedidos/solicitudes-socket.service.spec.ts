import { TestBed, inject } from '@angular/core/testing';

import { SolicitudesSocketService } from './solicitudes-socket.service';

describe('SolicitudesSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SolicitudesSocketService]
    });
  });

  it('should be created', inject([SolicitudesSocketService], (service: SolicitudesSocketService) => {
    expect(service).toBeTruthy();
  }));
});
