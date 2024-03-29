import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ErrorStateMatcher} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Filter, FilterConstants, Tag, TagConstants } from '../app.constants';

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
  @Output() refresh = new EventEmitter();
  currentFilters : Filter;
  allTags : Tag[]
  matcher = new MyErrorStateMatcher();
  filterForm: FormGroup;

  // convenience getter for easy access to form fields
  get f() { return this.filterForm.controls; }

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.currentFilters = {} as Filter;
    for (let x in FilterConstants.DEFAULT_FILTERS) {
      this.currentFilters[x] = FilterConstants.DEFAULT_FILTERS[x];
    }

    this.filterForm = this.formBuilder.group({
            minRating: ['', Validators.min(0)],
            maxRating: ['', Validators.min(0)],
        });

    this.allTags = [];
    
    for (let tag in TagConstants.LIST_OF_TAGS) {
      this.allTags.push({name : TagConstants.LIST_OF_TAGS[tag], isActive : false});
    }
  }

  toggleTag(tag : Tag): void {
    tag.isActive = !tag.isActive;

    this.currentFilters.tags = [];
    for (let tag of this.allTags) {
      if (tag.isActive) {
        this.currentFilters.tags.push(tag.name);
      }
    }

    this.updateFilters();
  }

  clearTags(): void {
    this.currentFilters.tags = [];
    for (let tag of this.allTags) {
      tag.isActive = false;
    }

    this.updateFilters();
  }

  setTakenByOr(): void {
    this.currentFilters.tagsTakenByOr = !this.currentFilters.tagsTakenByOr;

    this.updateFilters();
  }

  setSolvedBy(choice : number): void {
    this.currentFilters.relationToUser = choice;

    this.updateFilters();
  }

  updateFilters(): void {
    this.filters.emit(this.currentFilters);
  }

  submitFilters(): void {
    this.refresh.emit();
  }
}
