import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { PaginatedResult } from '../_models/Pagination';
import { Message } from '../_models/Message';
import { map } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({
        'Authorization' : 'Bearer' + localStorage.getItem('token')
    })
};

@Injectable({
    providedIn: 'root'
})

export class UserService {
        baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getUsers(page?: number, itemsPerPage?: number,
             userParams?: any, likesParam?: string) {
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

        let params = new HttpParams();

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page.toString());
            params = params.append('pageSize', itemsPerPage.toString());
        }

        if (userParams != null) {
            params = params.append('minAge', userParams.minAge);
            params = params.append('maxAge', userParams.maxAge);
            params = params.append('gender', userParams.gender);
            params = params.append('orderBy', userParams.orderBy);
          }

          if (likesParam === 'Likers') {
            params = params.append('Likers', 'true');
          }

          if (likesParam === 'Likees') {
            params = params.append('Likees', 'true');
          }

          return this.http.get<User[]>(this.baseUrl + 'users', { observe: 'response', params})
          .pipe(
            map(response => {
              paginatedResult.result = response.body;
              if (response.headers.get('Pagination') != null) {
                paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
              }
              return paginatedResult;
            })
          );
    }

    getUser(id: number): Observable<User> {
        return this.http.get<User>(this.baseUrl + 'users/' + id, httpOptions);
    }

    updateUser(id: number, user: User) {
        return this.http.put(this.baseUrl + 'users/' + id, user, httpOptions);
    }

    setMainPhoto(userId: number, id: number) {
        return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
    }

    sendLike(id: number, recipientId: number) {
        return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
    }

    getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
        const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
        let params = new HttpParams();

        params = params.append('MessageContainer', messageContainer);

        if (page != null && itemsPerPage != null) {
          params = params.append('pageNumber', page);
          params = params.append('pageSize', itemsPerPage);
        }

        return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response', params})
          .pipe(
            map(response => {
              paginatedResult.result = response.body;
              if (response.headers.get('Pagination') !== null) {
                paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
              }
              return paginatedResult;
            })
          );
      }

      getMessageThread(id: number, recipientId: number) {
        return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
      }

    sendMessage(userId: number, message: Message) {
        return this.http.post<Message>(this.baseUrl  + 'users/' + userId +  '/messages', message);
    }

    deleteMessage(id: number, userId: number) {
        return this.http.post(this.baseUrl +  'users/' + userId + '/messages/' + id, {}).pipe(
                map(response => {}));
    }

    markAsRead(id: number, userId: number) {
      return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id + '/read', {}).subscribe();
    }


    deletePhoto(userId: number, id: number) {
        return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
    }

}
