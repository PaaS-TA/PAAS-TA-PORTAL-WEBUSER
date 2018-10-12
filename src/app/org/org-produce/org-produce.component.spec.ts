import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgProduceComponent } from './org-produce.component';

describe('OrgProduceComponent', () => {
  let component: OrgProduceComponent;
  let fixture: ComponentFixture<OrgProduceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgProduceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgProduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
