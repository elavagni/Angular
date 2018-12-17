import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { Injectable } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Message } from '../_models/Message';
import { AuthService } from '../_services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MessageResolver implements Resolve<Message[]> {
    pageSize = 4;
    pageNumber = 1;
    messageContainer = 'Unread';

    constructor(private router: Router,
                private alertify: AlertifyService,
                private authService: AuthService,
                private userService: UserService ) {}


    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this.userService.getMessages(this.authService.decodedToken.nameid,
                this.pageNumber, this.pageSize, this.messageContainer).pipe(
                catchError(error => {
                   console.log(error);
                    this.alertify.error('Problem retrieving data');
                    this.router.navigate(['members/']);
                    return of(null);
                })
            );
        }
    }
