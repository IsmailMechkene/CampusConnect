import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitsSection } from './benefits-section';

describe('BenefitsSection', () => {
  let component: BenefitsSection;
  let fixture: ComponentFixture<BenefitsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenefitsSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenefitsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
