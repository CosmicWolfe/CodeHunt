import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { Question, Filter, FilterConstants } from '../app.constants';
import { CodeforcesService } from '../services/codeforces.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  username: string;
  userQuestions: Question[];
  userQuestionsSub: Subscription;
  filteredUserQuestions: Question[];
  currentFilters: Filter;

  constructor(private codeforcesService: CodeforcesService) {}

  ngOnInit(): void {
    this.currentFilters = {} as Filter;
    for (let x in FilterConstants.DEFAULT_FILTERS) {
      this.currentFilters[x] = FilterConstants.DEFAULT_FILTERS[x];
    }

    this.codeforcesService.initializeService();
    this.userQuestionsSub = this.codeforcesService.userQuestions.subscribe(userQuestions => {
      this.userQuestions = userQuestions.slice();
      this.filterQuestions();
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.userQuestionsSub.unsubscribe();
  }

  public submitUsername() {
    this.codeforcesService.changeUsername(this.username);
  }

  public updateFilters(filter : Filter) {
    this.currentFilters = filter;
  }

  public filterQuestions() {
    // filters the questions according to the filters, and userSubmissions
    let filters : Filter = {} as Filter;
    for (let x in this.currentFilters) {
      filters[x] = this.currentFilters[x];
    }
    
    if (!filters.maxRating) {
      filters.maxRating = 3500;
    }
    if (!filters.minRating) {
      filters.minRating = 0;
    }
    
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

    this.filteredUserQuestions = filteredQuestions;
  }
}