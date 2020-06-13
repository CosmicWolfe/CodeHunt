import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-filters',
  templateUrl: './question-filters.component.html',
  styleUrls: ['./question-filters.component.scss']
})


export class QuestionFiltersComponent implements OnInit {
  @Output() filters = new EventEmitter<Filter>();
  currentFilters : Filter;

  constructor() { }

  ngOnInit(): void {
  }

  emit(): void {
    this.filters.emit(currentFilters);
  }
}
