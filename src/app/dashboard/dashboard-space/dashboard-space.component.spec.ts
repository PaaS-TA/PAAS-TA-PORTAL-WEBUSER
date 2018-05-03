import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSpaceComponent } from './dashboard-space.component';

describe('DashboardSpaceComponent', () => {
  let component: DashboardSpaceComponent;
  let fixture: ComponentFixture<DashboardSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
