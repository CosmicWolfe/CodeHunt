import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionFiltersComponent } from './question-filters.component';

describe('QuestionFiltersComponent', () => {
  let component: QuestionFiltersComponent;
  let fixture: ComponentFixture<QuestionFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
