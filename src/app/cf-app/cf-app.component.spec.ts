import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CfAppComponent } from './cf-app.component';

describe('CfAppComponent', () => {
  let component: CfAppComponent;
  let fixture: ComponentFixture<CfAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CfAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CfAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
