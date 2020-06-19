import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ErrorStateMatcher} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Filter, Tag } from '../app.constants';

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
                           tags : [], tagsTakenByOr : true,
                           sortBy : "solvedCount", ascending : true,
                           numberOfRows : 50, solvedByUser : 0};

    this.filterForm = this.formBuilder.group({
            minRating: ['', Validators.min(0)],
            maxRating: ['', Validators.min(0)],
        });

    this.allTags = [{name : "greedy", isActive : false},
                    {name : "dp", isActive : false},
                    {name : "math", isActive : false}/*,
                    {name : "binary search", isActive : false},
                    {name : "geometry", isActive : false},
                    {name : "graph", isActive : false},
                    {name : "data structures", isActive : false},
                    {name : "bitmasks", isActive : false},
                    {name : "divide and conquer", isActive : false}*/
                    ];
  }

  toggleTag(tag : Tag): void {
    tag.isActive = !tag.isActive;
  }

  setTakenByOr(): void {
    this.currentFilters.tagsTakenByOr = !this.currentFilters.tagsTakenByOr;
  }

  setAscending(): void {
    this.currentFilters.ascending = !this.currentFilters.ascending;
  }


  setSolvedBy(choice : number): void {
    this.currentFilters.solvedByUser = choice;
  }

  setSortBy(choice : number): void {
    if (choice == 0)
      this.currentFilters.sortBy = "index";
    if (choice == 1)
      this.currentFilters.sortBy = "solvedCount";
    if (choice == 2)
      this.currentFilters.sortBy = "rating";
  }

  setNumberOfRows(noOfRows : number): void {
    this.currentFilters.numberOfRows = noOfRows;
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
