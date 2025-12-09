import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectShop } from './inspect-shop';

describe('InspectShop', () => {
  let component: InspectShop;
  let fixture: ComponentFixture<InspectShop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectShop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectShop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
