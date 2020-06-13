import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  username: String;
  userSubmissions: [];
  userQuestions = [
    {
      contestId: 4,
      index: '4A',
      name: 'Watermelon',
      solvedCount: 12345,
      rating: 800
    },
    {
      contestId: 5,
      index: 'B',
      name: 'Orange',
      solvedCount: 123456,
      rating: 8000
    }
  ];

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    
  }

  public submitUsername() {
    this.httpClient.get('http://127.0.0.1:5002/problems/' + this.username).subscribe(data => {
      let questions = [];
      for (let key in data) {
        questions.push(data[key]);
      }
      this.userQuestions = questions;
    })
    // get user submissions from python, then filter
    this.filterProblems();
  }

  public updateFilters(filter : Filter) {
  
  }

  private filterProblems() {
    // filters the problems according to the filters, and userSubmissions
  }

}
