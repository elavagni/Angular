import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelper } from 'angular2-jwt';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  jwtHelper = new JwtHelper();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.decotedToken = this.jwtHelper.decodeToken(token);
    }
  }
}
