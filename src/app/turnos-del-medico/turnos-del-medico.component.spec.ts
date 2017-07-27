import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosDelMedicoComponent } from './turnos-del-medico.component';

describe('TurnosDelMedicoComponent', () => {
  let component: TurnosDelMedicoComponent;
  let fixture: ComponentFixture<TurnosDelMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnosDelMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnosDelMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
