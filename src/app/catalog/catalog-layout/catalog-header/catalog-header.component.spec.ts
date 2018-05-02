import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogHeaderComponent } from './catalog-header.component';

describe('CatalogHeaderComponent', () => {
  let component: CatalogHeaderComponent;
  let fixture: ComponentFixture<CatalogHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
