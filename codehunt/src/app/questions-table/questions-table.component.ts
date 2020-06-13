import { Component, OnInit, SimpleChange, Input } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';

@Component({
  selector: 'app-questions-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.scss']
})

export class QuestionsTableComponent implements OnInit {
  // will take as input user handle, and filters
  @Input('questions') questions : []

  questionsTest = [
    {
      contestId: 4,
      index: 'A',
      name: 'Watermelon',
      solvedBy: 12345,
      difficulty: 800
    },
    {
      contestId: 5,
      index: 'B',
      name: 'Orange',
      solvedBy: 123456,
      difficulty: 8000
    }
  ];

  displayedColumns: string[] = ['id', 'name', 'solvedBy', 'difficulty', 'solved'];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes : SimpleChange): void {
    console.log(changes);
  }

}
