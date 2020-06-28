import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../app.constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodeforcesService {
  private username: string;
  private problems = new Map();

  private userQuestionsSource = new BehaviorSubject<Array<Question>>([]);
  public userQuestions = this.userQuestionsSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  public initializeService() {
    this.refreshProblems();
  }

  public changeUsername(newUsername: string) {
    this.username = newUsername;
    this.getQuestions();
  }

  private getQuestions() {
    this.problems.forEach((value, key, map) => {
      value["solvedByUser"] = false;
      value["attemptedByUser"] = false;
    });

    if (this.username) {
      let url = "https://codeforces.com/api/user.status?handle=" + this.username;

      let resultSub = this.httpClient.get(url).subscribe(data => {
         for (let idx in data["result"]) {
           let submission = data["result"][idx];
           let problem = submission["problem"];
           let contestId = (problem["contestId"] ? String(problem["contestId"]) : "X");
           let index = contestId + problem["index"]

           if (this.problems.has(index)) {
             this.problems.get(index)["attemptedByUser"] = true;
             if (submission["verdict"] == "OK") {
               this.problems.get(index)["solvedByUser"] = true;
             }
           }
         }

         let questions = [];
         this.problems.forEach((value, key, map) => {
           questions.push(value);
           questions[questions.length - 1].tags = value["tags"].slice();
         });

         this.userQuestionsSource.next(questions);
         resultSub.unsubscribe();
      });
     } else {
       let questions = [];
       this.problems.forEach((value, key, map) => {
         questions.push(value);
         questions[questions.length - 1].tags = value["tags"].slice();
       });
       this.userQuestionsSource.next(questions);
    }
  }

  private refreshProblems() {
    let url = "https://codeforces.com/api/problemset.problems"

    let resultSub = this.httpClient.get(url).subscribe(data => {
      for (let idx in data["result"]["problems"]) {
        let problem = data["result"]["problems"][idx];

        let problemId = problem["index"]
        let contestId = (problem["contestId"] ? String(problem["contestId"]) : "X");
        let index = contestId + problem["index"]
        let name = problem["name"]
        let rating = (problem["rating"] ? problem["rating"] : 0);
        this.problems.set(index, {
          index : index,
          problemId : problemId,
          contestId : contestId,
          name : name,
          rating : rating,
          solvedByUser : false,
          attemptedByUser : false,
          solvedCount : 0,
          tags : problem["tags"].slice()
        });
      }

      for (let idx in data["result"]["problemStatistics"]) {
        let problemStats = data["result"]["problemStatistics"][idx];
         
        let contestId = (problemStats["contestId"] ? String(problemStats["contestId"]) : "X");
        let index = contestId +  problemStats["index"];
        let solvedCount = problemStats["solvedCount"];
        
        let problem = this.problems.get(index);
        if (problem.name.startsWith("Labyrinth-") && Number(problem.index) > 90000) {
          this.problems.delete(index);
        }
        else {
          this.problems.get(index).solvedCount = solvedCount;
        }
      }

      resultSub.unsubscribe();
      this.getQuestions();
   });
  }
}
