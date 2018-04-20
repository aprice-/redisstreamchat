import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {UserNameService} from './services/user-name.service';
import {Modal} from './components/modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('modal') modal: Modal;

  constructor (public userNameService: UserNameService) {
  }

  ngAfterViewInit(): void {
    if (!this.userNameService.userName) {
      this.modal.show();
    }
  }
}
