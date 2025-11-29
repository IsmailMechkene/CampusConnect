import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedShops } from './featured-shops';

describe('FeaturedShops', () => {
  let component: FeaturedShops;
  let fixture: ComponentFixture<FeaturedShops>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedShops]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedShops);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
