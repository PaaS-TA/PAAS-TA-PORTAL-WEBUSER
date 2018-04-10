import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCodeComponent } from './auth-code.component';

describe('AuthCodeComponent', () => {
  let component: AuthCodeComponent;
  let fixture: ComponentFixture<AuthCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
