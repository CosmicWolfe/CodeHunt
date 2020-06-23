import { Component, OnInit, SimpleChange, Input, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Question } from '../app.constants';

@Component({
  selector: 'app-questions-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.scss']
})

export class QuestionsTableComponent implements OnInit {
  // will take as input user handle, and filters
  @Input('questions') questions : Question[]

  displayedColumns: string[] = ['No.', 'index', 'name', 'solvedCount', 'rating'];
  dataSource = new MatTableDataSource<Question>(this.questions);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor() {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortData = (data: Question[], sort: MatSort) => {
      let sortedData = data.slice();
      const filters = {
        ascending: this.sort.direction == 'asc',
        sortBy: this.sort.active
      };
      sortedData.sort((q1: Question, q2: Question) => {
        let sortDirection = filters.ascending ? 1 : -1;
        if (filters.sortBy == 'rating') {
          if (q2.rating != q1.rating) {
            return (q2.rating - q1.rating) * sortDirection;
          }
          return q2.solvedCount - q1.solvedCount;
        } else if (filters.sortBy == 'index') {
          if (q1.contestId == q2.contestId) {
            return q1.problemId.localeCompare(q2.problemId) * sortDirection;
          }
          return ((q2.contestId) - (q1.contestId)) * sortDirection;
        }
        return (q2.solvedCount - q1.solvedCount) * sortDirection;
      });
      return sortedData;
    };
  }

  ngOnChanges(changes : SimpleChange): void {
    console.log(changes);
    this.dataSource.data = this.questions;
    this.dataSource.paginator = this.paginator;
  }
}
