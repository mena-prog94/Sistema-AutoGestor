import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarPiezaPage } from './agregar-pieza.page';

describe('AgregarPiezaPage', () => {
  let component: AgregarPiezaPage;
  let fixture: ComponentFixture<AgregarPiezaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarPiezaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
