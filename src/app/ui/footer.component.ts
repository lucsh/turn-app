import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footer',
  template:`
	    <div class="footer">
            <div class="pull-right">
                10GB of <strong>250GB</strong> Free.
            </div>
            <div>
                <strong>Copyright</strong> Codetry &copy; 2017
            </div>
        </div>
  `
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
