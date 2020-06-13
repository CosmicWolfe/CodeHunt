import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-question-filters',
  templateUrl: './question-filters.component.html',
  styleUrls: ['./question-filters.component.scss']
})


export class QuestionFiltersComponent implements OnInit {
  @Output() filters = new EventEmitter<Filter>();
  currentFilters : Filter;

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
