import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogServiceComponent } from './catalog-service.component';

describe('CatalogServiceComponent', () => {
  let component: CatalogServiceComponent;
  let fixture: ComponentFixture<CatalogServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
