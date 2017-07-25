import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesDelDiaComponent } from './pacientes-del-dia.component';

describe('PacientesDelDiaComponent', () => {
  let component: PacientesDelDiaComponent;
  let fixture: ComponentFixture<PacientesDelDiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PacientesDelDiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacientesDelDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
