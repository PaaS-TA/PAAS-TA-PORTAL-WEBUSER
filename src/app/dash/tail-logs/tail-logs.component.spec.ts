import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TailLogsComponent } from './tail-logs.component';

describe('TailLogsComponent', () => {
  let component: TailLogsComponent;
  let fixture: ComponentFixture<TailLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TailLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TailLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
