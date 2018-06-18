import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgNavComponent } from './org-nav.component';

describe('OrgNavComponent', () => {
  let component: OrgNavComponent;
  let fixture: ComponentFixture<OrgNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
