import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpasswdComponent } from './resetpasswd.component';

describe('ResetpasswdComponent', () => {
  let component: ResetpasswdComponent;
  let fixture: ComponentFixture<ResetpasswdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetpasswdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetpasswdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
