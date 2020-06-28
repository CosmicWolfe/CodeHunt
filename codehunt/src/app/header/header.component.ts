import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  chosenSite : string;
  @Output() setChosenSiteEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    this.setChosenSite('codeforces');
  }

  setChosenSite(newChosenSite : string) {
    this.chosenSite = newChosenSite;
    this.setChosenSiteEvent.emit(newChosenSite);
  }
}
