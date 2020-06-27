import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  chosenSite : string;

  constructor() {
  }

  public setChosenSite(newChosenSite : string) {
    this.chosenSite = newChosenSite;
  }
}
