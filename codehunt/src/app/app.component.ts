import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'codehunt';
  
  serverData: JSON;
  employeeData: JSON;
  
  constructor(private httpClient: HttpClient) {
  }

  sayHi() {
    this.title = 'po';
    this.httpClient.get('http://127.0.0.1:5002/problems/jt3698').subscribe(data => {
      this.serverData = data as JSON;
      console.log(this.serverData);
      this.title = JSON.stringify(this.serverData);
    })
  }

  getAllEmployees() {
    this.httpClient.get('http://127.0.0.1:5002/employees').subscribe(data => {
      this.employeeData = data as JSON;
      console.log(this.employeeData);
    })
  }
}
