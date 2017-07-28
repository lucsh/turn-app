import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionMedicoComponent } from './configuracion-medico.component';

describe('ConfiguracionMedicoComponent', () => {
  let component: ConfiguracionMedicoComponent;
  let fixture: ComponentFixture<ConfiguracionMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracionMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
