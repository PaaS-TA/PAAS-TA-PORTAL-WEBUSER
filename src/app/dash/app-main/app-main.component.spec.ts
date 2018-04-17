import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMainComponent } from './app-main.component';

describe('AppMainComponent', () => {
  let component: AppMainComponent;
  let fixture: ComponentFixture<AppMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
