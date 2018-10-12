import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgMainComponent } from './org-main.component';

describe('OrgMainComponent', () => {
  let component: OrgMainComponent;
  let fixture: ComponentFixture<OrgMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
