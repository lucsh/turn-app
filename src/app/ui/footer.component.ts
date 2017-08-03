import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footer',
  template:`
	    <section class="footer" style="z-index:999;">
            <div class="pull-right">
                Clínica de la Visión - <strong>Neuquén</strong>.
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
