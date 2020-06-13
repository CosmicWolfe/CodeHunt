import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ErrorStateMatcher} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-question-filters',
  templateUrl: './question-filters.component.html',
  styleUrls: ['./question-filters.component.scss']
})

export class QuestionFiltersComponent implements OnInit {
  @Output() filters = new EventEmitter<Filter>();
  currentFilters : Filter;

  difficultyFormControl = new FormControl('', [
    Validators.min(0),
    Validators.max(1000000)
  ]);

  matcher = new MyErrorStateMatcher();

  constructor() {
    this.currentFilters = {minRating : 800, maxRating : 3500,
                           tags : [], tagsTakenByOr : true,
                           sortBy : "solvedCount", ascending : true,
                           numberOfRows : 50, solvedByUser : 0}
  }

  ngOnInit(): void {
  }

  submitFilters(): void {
  
  }

  emit(): void {
    this.filters.emit(this.currentFilters);
  }
}
