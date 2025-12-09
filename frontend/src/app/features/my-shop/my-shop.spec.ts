import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyShop } from './my-shop';

describe('MyShop', () => {
  let component: MyShop;
  let fixture: ComponentFixture<MyShop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyShop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyShop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
