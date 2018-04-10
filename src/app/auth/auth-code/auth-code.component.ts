import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UaaSecurityService} from '../uaa-security.service';

@Component({
  selector: 'app-auth-code',
  template: `
    <p>
      auth-code works!
    </p>
  `,
  styles: []
})
export class AuthCodeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private uaa: UaaSecurityService) {
    this.route.params.subscribe(params => {
        console.log(params);
        // uaa.authCode = params.authCode;
      }
    );
  }

  ngOnInit() {
  }

}
