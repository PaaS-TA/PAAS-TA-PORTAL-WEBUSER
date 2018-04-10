import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottonComponent } from './botton.component';

describe('BottonComponent', () => {
  let component: BottonComponent;
  let fixture: ComponentFixture<BottonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
