import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteOrgComponent } from './invite-org.component';

describe('InviteOrgComponent', () => {
  let component: InviteOrgComponent;
  let fixture: ComponentFixture<InviteOrgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteOrgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
