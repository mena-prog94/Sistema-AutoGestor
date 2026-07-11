import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PiezasPage } from './piezas.page';

describe('PiezasPage', () => {
  let component: PiezasPage;
  let fixture: ComponentFixture<PiezasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PiezasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
