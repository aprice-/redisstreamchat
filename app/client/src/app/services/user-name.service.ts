import {Injectable} from '@angular/core';

@Injectable()
export class UserNameService {

  userName: string;

  constructor() {
    this.load();
  }

  load () {
    this.userName = localStorage.getItem('userName');
  }

  save () {
    localStorage.setItem('userName', this.userName);
  }
}
