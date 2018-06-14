import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Org2MainComponent } from './org2-main.component';

describe('Org2MainComponent', () => {
  let component: Org2MainComponent;
  let fixture: ComponentFixture<Org2MainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Org2MainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Org2MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
