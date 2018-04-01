import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/Observable/throw';
import 'rxjs/add/operator/catch';
import { User } from '../_models/User';

@Injectable()
export class UserService {
    baseUrl = environment.apiUrl;
constructor(private http: Http) { }

getUsers(): Observable<User[]> {
    return this.http.get(this.baseUrl + 'users', this.jwt())
    .map(response => <User[]>response.json())
    .catch(this.handleError);
}

private jwt() {
    const token = localStorage.getItem('token');
    if (token) {
        const headers = new Headers({'Authorization' : 'Bearer ' + token});
        headers.append('Content-type', 'application/json');
        return new RequestOptions({headers: headers});
    }
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
