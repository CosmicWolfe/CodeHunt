import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

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
    tags: ['greedy', 'dp'],
    tagsTakenByOr: false,
    solvedByUser: 0,
    sortBy: 'solvedCount',
    ascending: true,
    numberOfRows: 50
  };

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.userQuestionsSubscription = this.httpClient.get('http://127.0.0.1:5002/problems/NoSubmissions').subscribe(data => {
      let questions = [];
      for (let key in data) {
        questions.push(data[key]);
        questions[questions.length - 1].tags = data[key].tags.slice(0);
        if (questions.length == 100) break;
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

    this.userQuestionsSubscription.unsubscribe();
    this.userQuestionsSubscription = this.httpClient.get('http://127.0.0.1:5002/problems/' + this.username).subscribe(data => {
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

  private filterQuestions() {
    // filters the questions according to the filters, and userSubmissions
    let filters = this.currentFilters;
    console.log("filters");
    console.log(filters);

    console.log("userQuestions before filter");
    console.log(this.userQuestions);
    
    let filteredQuestions = this.userQuestions.filter((question: Question) => {
      //console.log("theQuestion");
      //console.log(question);
      if (question.rating < filters.minRating || question.rating > filters.maxRating) {
        //console.log("rating out");
        return false;
      }
      
      if (filters.solvedByUser == 1) {
        if (question.solvedByUser) {
          //console.log("solvedby 1 out");
          return false;
        }
      } else if (filters.solvedByUser == 2) {
        if (!question.solvedByUser) {
          //console.log("solvedby 2 out");
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
          //console.log("filter tagor out");
          return false;
        }
      } else {
        for (let i = 0; i < filters.tags.length; ++i) {
          /*console.log(filters.tags[i]);
          console.log("question tags");
          console.log(question.tags);*/
          if (!question.tags.includes(filters.tags[i])) {
            //console.log("filter tag not or out");
            return false;
          }
        }
      }
      //console.log("returning true");
      return true;
    });

    console.log("filteredQuestions after filter");
    console.log(filteredQuestions);

    filteredQuestions.sort((q1: Question, q2: Question) => {
      let sortDirection = filters.ascending ? 1 : -1;
      if (filters.sortBy == 'rating') {
        return (q2.rating - q1.rating) * sortDirection;
      } else if (filters.sortBy == 'index') {
        return ((q2.index > q1.index) ? 1 : -1) * sortDirection;
      }
      return (q2.solvedCount - q1.solvedCount) * sortDirection;
    });

    console.log("filteredQuestions after sort");
    console.log(filteredQuestions);

    let tempFilteredUserQuestions = filteredQuestions.slice(0, Math.min(this.userQuestions.length, filters.numberOfRows));
    this.filteredUserQuestions = tempFilteredUserQuestions;
  }

}
