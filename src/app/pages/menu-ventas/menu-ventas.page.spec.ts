import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuVentasPage } from './menu-ventas.page';

describe('MenuVentasPage', () => {
  let component: MenuVentasPage;
  let fixture: ComponentFixture<MenuVentasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MenuVentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
