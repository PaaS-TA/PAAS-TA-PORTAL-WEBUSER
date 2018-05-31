import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityNavComponent } from './quantity-nav.component';

describe('QuantityNavComponent', () => {
  let component: QuantityNavComponent;
  let fixture: ComponentFixture<QuantityNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantityNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
