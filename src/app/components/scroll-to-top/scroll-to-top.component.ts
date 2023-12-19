import { Component, OnInit, HostListener  } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.css'],
})
export class ScrollToTopComponent implements OnInit {
  constructor() { }

  ngOnInit(): void { }

  showScrollTop = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollTop = window.scrollY > 100;
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }



}
