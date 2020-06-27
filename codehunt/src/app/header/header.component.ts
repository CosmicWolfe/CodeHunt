import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() chosenSite : string;
  @Output() setChosenSiteEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  setChosenSite(newChosenSite : string) {
    this.setChosenSiteEvent.emit(newChosenSite);
  }
}
