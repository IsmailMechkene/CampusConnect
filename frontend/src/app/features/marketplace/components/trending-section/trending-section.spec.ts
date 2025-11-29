import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingSection } from './trending-section';

describe('TrendingSection', () => {
  let component: TrendingSection;
  let fixture: ComponentFixture<TrendingSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrendingSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
