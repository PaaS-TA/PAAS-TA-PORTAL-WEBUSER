import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgInnerComponent } from './org-inner.component';

describe('OrgInnerComponent', () => {
  let component: OrgInnerComponent;
  let fixture: ComponentFixture<OrgInnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgInnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
