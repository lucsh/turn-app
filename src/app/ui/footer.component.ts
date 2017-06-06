import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footer',
  template:`
	    <section class="footer" style="z-index:999;">
            <div class="pull-right">
                10GB of <strong>250GB</strong> Free.
            </div>
            <div>
                <strong>Copyright</strong> Codetry &copy; 2017
            </div>
        </section>
  `
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
