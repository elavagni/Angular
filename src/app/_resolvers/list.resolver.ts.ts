import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { Injectable } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable()
export class ListResolver implements Resolve<User[]> {

    constructor(private userService: UserService, private router: Router, private alertify: AlertifyService) { }
    pageSize = 5;
    pageNumber = 1;
    likesParam = 'LikesReceived';

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUsers(this.pageNumber, this.pageSize, null, this.likesParam).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['home/']);
                return of(null);
            })
        );
    }
}
