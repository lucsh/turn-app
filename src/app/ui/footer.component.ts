import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footer',
  template:`
	    <section class="footer hidden-sm hidden-xs" style="z-index:999;">
            <div class="pull-right">
                Centro de la Visión - <strong>Neuquén</strong>.
            </div>
            <div>
                <strong>Copyright</strong> Codetry &copy; 2017 &nbsp;  | &nbsp;  <a target="_blank"  href="http://manual.centrodelavisionnqn.com.ar/">Manual Online</a>
            </div>
        </section>
  `
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
