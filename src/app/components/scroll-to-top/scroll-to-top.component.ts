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
    // Check the scroll position and toggle the class
    this.showScrollTop = window.scrollY > 100; // You can adjust the threshold as needed
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }



}
