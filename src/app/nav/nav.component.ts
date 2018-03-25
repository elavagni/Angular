import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private authservice: AuthService, private alertify: AlertifyService) {}

  ngOnInit() {
  }

  login()  {
    this.authservice.login(this.model).subscribe(data => {
     this.alertify.success('logged in sucessfully');
    }, error => {
      this.alertify.error('Failed to login');
    });
  }

    logout() {
      this.authservice.userToken = null;
      localStorage.removeItem('token');
      this.alertify.message('log out');
    }

    loggedIn() {
      return this.authservice.loggedIn();
    }
  }
