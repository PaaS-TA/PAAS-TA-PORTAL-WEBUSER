import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgTempComponent } from './org-temp.component';

describe('OrgTempComponent', () => {
  let component: OrgTempComponent;
  let fixture: ComponentFixture<OrgTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
