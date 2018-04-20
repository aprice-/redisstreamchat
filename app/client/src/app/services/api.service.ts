
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {UserNameService} from './user-name.service';
import {IMessage} from './message';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ApiService {

  baseUrl = '/api';

  constructor(private httpClient: HttpClient) {
  }

  join (channel: string) {
    return this.httpClient.post<IResponse>(`${this.baseUrl}/join/${channel}`, null);
  }

  part (channel: string) {
    return this.httpClient.post<IResponse>(`${this.baseUrl}/part/${channel}`, null);
  }

  send (channel: string, message: string) {
    return this.httpClient.post<IResponse>(`${this.baseUrl}/channel/${channel}`, {message});
  }

  getMessages (channel: string, before: string = null) {
    return this.httpClient.get<IResponse & {messages: IMessage[]}>(`${this.baseUrl}/channel/${channel}`, before ? {params: {before}} : {})
      .map(response => response.messages);
  }

  getMembers (channel: string) {
    return this.httpClient.get<IResponse & {members: string[]}>(`${this.baseUrl}/channel/${channel}/members`).map(response => response.members);
  }
}

@Injectable()
export class UserNameInterceptor implements HttpInterceptor {

  constructor (private userNameService: UserNameService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({ headers: req.headers.set('x-username', this.userNameService.userName) });
    return next.handle(clonedRequest);
  }
}

interface IResponse {
  error?: boolean;
  success?: boolean;
}
