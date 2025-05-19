import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComparePageComponent } from './product-compare-page.component';

describe('ProductComparePageComponent', () => {
  let component: ProductComparePageComponent;
  let fixture: ComponentFixture<ProductComparePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductComparePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
