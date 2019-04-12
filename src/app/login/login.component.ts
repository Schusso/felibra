import { Component, OnInit } from '@angular/core';
import {AuthService} from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }
  signIn() {
    this.auth.googleSignIn().then(function () {
      console.log('success');
      alert('then');
    }).catch(function (err) {
      console.log(err);
    });
  }
}
