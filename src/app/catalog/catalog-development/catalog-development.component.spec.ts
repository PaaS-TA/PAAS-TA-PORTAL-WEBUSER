import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogDevelopmentComponent } from './catalog-development.component';

describe('CatalogDevelopmentComponent', () => {
  let component: CatalogDevelopmentComponent;
  let fixture: ComponentFixture<CatalogDevelopmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogDevelopmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
