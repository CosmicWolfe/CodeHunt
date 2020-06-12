import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  username: String;
  userSubmissions: [];
  userQuestions: [];


  constructor() { }

  ngOnInit(): void {
  }

  public submitUsername() {
    // get user submissions from python, then filter
    this.filterProblems();
  }

  private filterProblems() {
    // filters the problems according to the filters, and userSubmissions
  }

}
