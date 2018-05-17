import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { decode } from 'punycode';
import { User } from '../_models/User';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
    baseUrl = environment.apiUrl;
    userToken: any;
    decotedToken: any;
    jwtHelper = new JwtHelper();
    currentUser: User;
    private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
    currentPhotoUrl = this.photoUrl.asObservable();

    constructor(private http: Http) { }

    changeMemberPhoto(photoUrl: string) {
        this.photoUrl.next(photoUrl);
    }
    login(model: any) {
      return this.http.post(this.baseUrl + 'auth/login', model, this.requestOptions()).map((response: Response) => {
            const user = response.json();
            if (user) {
                localStorage.setItem('token', user.tokenString);
                localStorage.setItem('user', JSON.stringify(user.user));
                this.decotedToken = this.jwtHelper.decodeToken(user.tokenString);
                this.currentUser = user.user;
                this.userToken = user.tokenString;
                if (this.currentUser.photoUrl !== null) {
                    this.changeMemberPhoto(this.currentUser.photoUrl);
                } else {
                    this.changeMemberPhoto('../../assets/user.png');
                }
            }
        }).catch(this.handleError);
    }
    public register(user: User) {
        return this.http.post(this.baseUrl + 'auth/register', user, this.requestOptions()).catch(this.handleError);
    }

    public loggedIn() {
        return tokenNotExpired('token');
    }

    private requestOptions() {
        const headers = new Headers({'Content-type': 'application/json'});
        const options = new RequestOptions({headers: headers});
        return options;
    }

    private handleError(error: any) {
        const applicationError = error.headers.get('Application-Error');
        if (applicationError) {
            return Observable.throw(applicationError);
        }
        const serverError = error.json();
        let modelStateError = '';
        if (serverError) {
            for (const key in serverError) {
                if (serverError[key]) {
                    modelStateError += serverError[key] + '\n';
                }
            }
        }
        return Observable.throw(
            modelStateError || 'Server error'
        );
    }
}
