import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Org2ProduceComponent } from './org2-produce.component';

describe('Org2ProduceComponent', () => {
  let component: Org2ProduceComponent;
  let fixture: ComponentFixture<Org2ProduceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Org2ProduceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Org2ProduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
