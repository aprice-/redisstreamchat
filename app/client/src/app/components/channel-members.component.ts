
import {Component} from '@angular/core';
import {UserNameService} from '../services/user-name.service';
import {ChannelService} from '../services/channel.service';

@Component({
  selector: 'channel-members',
  template: `<ul style="list-style-type: none;" class="px-3">
    <li *ngFor="let member of channelService.current?.members">
      <i class="fa fa-user"></i>{{member}}
    </li>
  </ul>`
})
export class ChannelMembersComponent {
  constructor (public userNameService: UserNameService, public channelService: ChannelService) {
  }
}
