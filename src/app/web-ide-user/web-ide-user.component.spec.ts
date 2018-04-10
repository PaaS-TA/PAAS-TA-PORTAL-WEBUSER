import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebIdeUserComponent } from './web-ide-user.component';

describe('WebIdeUserComponent', () => {
  let component: WebIdeUserComponent;
  let fixture: ComponentFixture<WebIdeUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebIdeUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebIdeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
