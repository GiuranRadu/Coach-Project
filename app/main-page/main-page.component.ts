import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

ElementRef
  constructor(private route: Router){}

  @ViewChild('videoContent') videoContent : ElementRef

  ngAfterViewInit() {
    this.videoContent.nativeElement.muted = true;
  }


}
