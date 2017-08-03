import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSemanaComponent } from './modal-semana.component';

describe('ModalSemanaComponent', () => {
  let component: ModalSemanaComponent;
  let fixture: ComponentFixture<ModalSemanaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSemanaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSemanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
