import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  photoUrl: string;
  model: any = {};

  constructor(public authservice: AuthService,
              private alertify: AlertifyService,
              private router: Router) {}

  ngOnInit() {
    this.authservice.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  login()  {
    this.authservice.login(this.model).subscribe(data => {
     this.alertify.success('logged in sucessfully');
    }, error => {
      this.alertify.error('Failed to login');
    }, () => {
        this.router.navigate(['/members']);
    });
  }

    logout() {
      this.authservice.userToken = null;
      this.authservice.currentUser = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.alertify.message('log out');
      this.router.navigate(['/home']);
    }

    loggedIn() {
      return this.authservice.loggedIn();
    }
  }
