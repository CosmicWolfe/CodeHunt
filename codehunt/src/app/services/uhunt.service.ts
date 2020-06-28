import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../app.constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UhuntService {
  private username: string;
  private problems = new Map();

  private userQuestionsSource = new BehaviorSubject<Array<Question>>([]);
  public userQuestions = this.userQuestionsSource.asObservable();
  private testSrc = new BehaviorSubject<any>(null);
  public test = this.testSrc.asObservable();

  constructor(private httpClient: HttpClient) { }

  public initializeService() {
    this.refreshProblems();
  }

  public changeUsername(newUsername: string) {
    this.username = newUsername;
    this.getQuestions();
  }

  private async getQuestions() {
    this.problems.forEach((value, key, map) => {
      value["solvedByUser"] = false;
      value["attemptedByUser"] = false;
    });

    if (this.username) {
      let url = "https://uhunt.onlinejudge.org/api/uname2uid/" + this.username;
      let resultId = this.httpClient.get(url).subscribe(id => {
        url = "https://uhunt.onlinejudge.org/api/subs-user/" + String(id);

        let resultSub = this.httpClient.get(url).subscribe(data => {
           for (let idx in data["subs"]) {
             let submission = data["subs"][idx];

             let problemId = String(submission[1]);
             let verdict = submission[2];

             if (this.problems.has(problemId)) {
               this.problems.get(problemId)["attemptedByUser"] = true;
               if (verdict == 90) {
                 this.problems.get(problemId)["solvedByUser"] = true;
               }
             }
           }

           let questions = [];
           this.problems.forEach((value, key, map) => {
             questions.push(value);
           });

           this.userQuestionsSource.next(questions);
           resultSub.unsubscribe();
        });

         resultId.unsubscribe();
      });
     } else {
       let questions = [];
       this.problems.forEach((value, key, map) => {
         questions.push(value);
       });
       this.userQuestionsSource.next(questions);
    }
  }

  private refreshProblems() {
    let url = "https://uhunt.onlinejudge.org/api/p"
    
    let resultSub = this.httpClient.get(url).subscribe(data => {
      for (let idx in data) {
        let problem = data[idx];

        let index = problem[1]
        let problemId = String(problem[0])
        let name = problem[2]
        let solvedCount = problem[3]
        this.problems.set(problemId, {
          index : String(index),
          problemId : problemId,
          contestId : 0,
          name : name,
          rating : 0,
          solvedByUser : false,
          attemptedByUser : false,
          solvedCount : solvedCount,
          tags : []
        });
      }

      resultSub.unsubscribe();
      this.getQuestions();
   });
  }
}
