
import {Component} from '@angular/core';
import {UserNameService} from '../services/user-name.service';
import {ChannelService} from '../services/channel.service';
import {Channel} from '../services/channel';

@Component({
  selector: 'channel-tabs',
  template: `<div class="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
    <a class="nav-link d-flex align-items-center pr-3"
       *ngFor="let channel of this.channelService.channels"
       role="tab"
       data-toggle="pill"
       (click)="tabClick($event, channel.name)" 
       [class.active]="channelService.current == channel" 
       [attr.href]="'#channel'+channel.name" 
       [attr.aria-controls]="'#channel'+channel.name" 
       [attr.aria-selected]="channelService.current == channel">
      <span class="pl-3 ml-3" [class.text-light]="channelService.current == channel">
        <i class="fa fa-slack"></i>{{channel.name}}
      </span>
      <span class="badge badge-secondary ml-2" *ngIf="unread(channel) > 0">{{unread(channel)}}</span>
      <button class="close" (click)="part(channel.name, $event)"><i class="fa fa-times"></i></button>
    </a>
  </div>`
})
export class ChannelTabsComponent {

  constructor (public userNameService: UserNameService, public channelService: ChannelService) {
  }

  tabClick(event, channelName: string) {
    this.channelService.change(channelName);
  }

  part(channelName, event) {
    this.channelService.part(channelName);
    event.preventDefault();
  }

  unread (channel: Channel) {
    if (channel) {
      return channel.messages.reduce((result, value) => {
        return value.id > channel.latestSeenId ? result + 1 : result;
      }, 0);
    }
  }
}
