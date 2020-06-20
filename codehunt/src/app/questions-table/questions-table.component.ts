import { Component, OnInit, SimpleChange, Input, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Question } from '../app.constants';

@Component({
  selector: 'app-questions-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.scss']
})

export class QuestionsTableComponent implements OnInit {
  // will take as input user handle, and filters
  @Input('questions') questions : []

  displayedColumns: string[] = ['No.', 'id', 'name', 'solvedBy', 'difficulty', 'solved'];
  dataSource = new MatTableDataSource<Question>(this.questions);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes : SimpleChange): void {
    console.log(changes);
    this.dataSource.data = this.questions;
    this.dataSource.paginator = this.paginator;
  }

}
