import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Question, Filter } from '../app.constants';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  username: String;
  userQuestions: Question[];
  userQuestionsSubscription: Subscription;
  filteredUserQuestions: Question[];
  currentFilters: Filter = {
    minRating: 800,
    maxRating: 3500,
    tags: [],
    tagsTakenByOr: false,
    relationToUser: 0
  };

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.userQuestionsSubscription = this.httpClient.get('http://127.0.0.1:5002/problems/NoSubmissions').subscribe(data => {
      let questions = [];
      for (let key in data) {
        questions.push(data[key]);
        questions[questions.length - 1].tags = data[key].tags.slice(0);
      }
      this.userQuestions = questions;
      console.log("oninit questions");
      console.log(this.userQuestions);
      this.filteredUserQuestions = questions;
      this.userQuestionsSubscription.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.userQuestionsSubscription.unsubscribe();
  }

  public submitUsername() {
    // check for valid username, then get userQuestions
    console.log(this.username)
    this.userQuestionsSubscription.unsubscribe();
    this.userQuestionsSubscription = this.httpClient.get('http://127.0.0.1:5002/problems/' +  this.username).subscribe(data => {
      let questions = [];
      for (let key in data) {
        questions.push(data[key]);
        questions[questions.length - 1].tags = data[key].tags.slice(0);
      }
      this.userQuestions = questions;
      console.log("received userQuestions");
      console.log(this.userQuestions);
      this.filterQuestions();
    });
  }

  public updateFilters(filter : Filter) {
    this.currentFilters = filter;
  }

  public filterQuestions() {
    // filters the questions according to the filters, and userSubmissions
    let filters = this.currentFilters;
    console.log("filters");
    console.log(filters);

    console.log("userQuestions before filter");
    console.log(this.userQuestions);
    
    let filteredQuestions = this.userQuestions.filter((question: Question) => {
      if (question.rating < filters.minRating || question.rating > filters.maxRating) {
        return false;
      }
      
      if (filters.relationToUser == 1) {
        if (question.solvedByUser) {
          return false;
        }
      } else if (filters.relationToUser == 2) {
        if (!question.solvedByUser) {
          return false;
        }
      } else if (filters.relationToUser == 3) {
        if (question.solvedByUser || !question.attemptedByUser) {
          return false;
        }
      }

      if (filters.tagsTakenByOr) {
        let foundTag = false;
        for (let i in question.tags) {
          if (filters.tags.includes(question.tags[i])) {
            foundTag = true;
            break;
          }
        }
        if (!foundTag && filters.tags.length > 0) {
          return false;
        }
      } else {
        for (let i = 0; i < filters.tags.length; ++i) {
          if (!question.tags.includes(filters.tags[i])) {
            return false;
          }
        }
      }
      return true;
    });

    console.log("filteredQuestions after filter");
    console.log(filteredQuestions);

    console.log("filteredQuestions after sort");
    console.log(filteredQuestions);

    this.filteredUserQuestions = filteredQuestions;
  }

}
