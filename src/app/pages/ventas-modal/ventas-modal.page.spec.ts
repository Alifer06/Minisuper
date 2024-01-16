import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentasModalPage } from './ventas-modal.page';

describe('VentasModalPage', () => {
  let component: VentasModalPage;
  let fixture: ComponentFixture<VentasModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VentasModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
