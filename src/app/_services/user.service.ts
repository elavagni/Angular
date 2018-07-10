import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/Observable/throw';
import 'rxjs/add/operator/catch';
import { User } from '../_models/User';
import { AuthHttp } from 'angular2-jwt';
import { PaginatedResult } from '../_models/Pagination';
import { Message } from '../_models/Message';

@Injectable()
export class UserService {
        baseUrl = environment.apiUrl;

    constructor(private authHttp: AuthHttp) { }

    getUsers(page?: number, itemsPerPage?: number,
             userParams?: any, likeParams?: string) {
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
        let queryString = '?';

        if (likeParams === 'Likers') {
            queryString += 'Likers=true&';
        }

        if (likeParams === 'Likees') {
            queryString += 'Likees=true&';
        }

        if (page != null && itemsPerPage != null) {
            queryString += 'pageNumber=' + page + '&pageSize=' + itemsPerPage + '&';
        }

        if (userParams != null) {
            queryString +=
            '&minAge=' + userParams.minAge +
            '&maxAge=' + userParams.maxAge +
            '&gender=' + userParams.gender +
            '&orderBy=' + userParams.orderBy;
        }

        return this.authHttp
        .get(this.baseUrl + 'users' + queryString)
        .map((response: Response) => {
            paginatedResult.result = response.json();

        if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
        })
        .catch(this.handleError);
    }

    getUser(id: number): Observable<User> {
        return this.authHttp.get(this.baseUrl + 'users/' + id)
        .map(response => <User>response.json())
        .catch(this.handleError);
    }

    updateUser(id: number, user: User) {
        return this.authHttp.put(this.baseUrl + 'users/' + id, user).catch(this.handleError);
    }

    setMainPhoto(userId: number, id: number) {
        return this.authHttp.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {}).catch(this.handleError);
    }

    private handleError(error: any) {
        if (error.status === 400) {
            return Observable.throw(error._body);
        }
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

    sendLike(id: number, recipientId: number) {
        console.log(recipientId);
        return this.authHttp.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {}).catch(this.handleError);
    }

    getMessages(userId: number, page?: number, itemsPerPage?: number, messageContainer?: string)  {
        const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
        let queryString = '?MessageContainer=' + messageContainer;

        if (page != null && itemsPerPage != null) {
            queryString += '&pageNumber' + page + '&pageSize' + itemsPerPage + '&';
        }
        return this.authHttp.get(this.baseUrl + 'users/' + userId + '/messages' + queryString)
            .map((response: Response) => {
                paginatedResult.result = response.json();

                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                }

                return paginatedResult;
            }).catch(this.handleError);
    }

    getMessageThread(userId: number, recipientId: number) {
        return this.authHttp.get(this.baseUrl + 'users/' + userId + '/messages/thread/' + recipientId)
            .map((respose: Response) => {
                return respose.json();
        }).catch(this.handleError);
    }


    deletePhoto(userId: number, id: number) {
        return this.authHttp.delete(this.baseUrl + 'users/' + userId + '/photos/' + id).catch(this.handleError);
    }

}
