import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityMainComponent } from './quantity-main.component';

describe('QuantityMainComponent', () => {
  let component: QuantityMainComponent;
  let fixture: ComponentFixture<QuantityMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantityMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
