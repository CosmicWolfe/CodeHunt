import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ErrorStateMatcher} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';

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
  allTags : Tag[]
  matcher = new MyErrorStateMatcher();
  filterForm: FormGroup;

  // convenience getter for easy access to form fields
  get f() { return this.filterForm.controls; }

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.currentFilters = {minRating : 800, maxRating : 3500,
                           tags : [], tagsTakenByOr : false,
                           sortBy : "solvedCount", ascending : true,
                           numberOfRows : 50, solvedByUser : 0};

    this.filterForm = this.formBuilder.group({
            minRating: ['', Validators.min(0)],
            maxRating: ['', Validators.min(0)],
        });

    this.allTags = [{name : "greedy", isActive : true},
                    {name : "dp", isActive : true},
                    {name : "math", isActive : true}];
  }

  toggle(tag : Tag): void {
    tag.isActive = !tag.isActive;
  }

  submitFilters(): void {
    this.currentFilters.tags = [];
    for (let tag of this.allTags) {
      if (tag.isActive) {
        this.currentFilters.tags.push(tag.name);
      }
    }

    this.filters.emit(this.currentFilters);
  }

  emit(): void {
    this.filters.emit(this.currentFilters);
  }
}
