import { TestBed } from '@angular/core/testing';

import { ToastAlertService } from './toast-alert.service';

describe('ToastAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastAlertService = TestBed.get(ToastAlertService);
    expect(service).toBeTruthy();
  });
});
