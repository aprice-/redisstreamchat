
import {AfterViewChecked, Component, ElementRef, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UserNameService} from '../services/user-name.service';
import {ChannelService} from '../services/channel.service';
import {IMessage} from '../services/message';

@Component({
  selector: 'channel-window',
  template: `<div class="channel-window" #scroll>
    <div class="row" *ngIf="!channelService.current">
      <div class="col">
        <h3 class="mt-3">Help</h3>
        <p class="my-2">
            To join (or create) a channel:
        </p>
        <code>/join [channel-name]</code>
        <p class="my-2">
          To part (or leave) a channel:
        </p>
        <code>/part [channel-name]</code>
        <p class="my-2">
          To perform an action:
        </p>
        <code>/me [action]</code>
      </div>
    </div>
    <div class="row" *ngIf="channelService.current">
      <div class="col text-center">
        <button class="btn btn-link" (click)="channelService.current?.loadMoreHistory()"><i class="fa fa-history"></i> Load more messages</button>
      </div>
    </div>
    <div class="row" *ngFor="let message of channelService.current?.messages; trackBy: trackByFn">
      <div class="col">
        <span *ngIf="message.message.indexOf('/me') === 0">
          <span class="text-action">{{message.message.replace('/me', message.userName)}}</span>
        </span>
        <span *ngIf="message.message.indexOf('/me') !== 0">
          <span class="text-info" *ngIf="message.userName">&lt;{{message.userName}}&gt;</span>
          <span [class.text-success]="message.join" [class.text-warning]="message.part">
            {{message.message}}
          </span>
        </span>
      </div>
      <div class="col-3 col-md-3 col-lg-2 text-right">
        <span class="text-secondary mr-3 timestamp">
          {{message.id | humanRelativeDate}}
        </span>
      </div>
    </div>
  </div>`
})
export class ChannelWindowComponent implements AfterViewChecked {
  needScroll: boolean = false;

  @ViewChild('scroll') scroll: ElementRef;

  constructor (public userNameService: UserNameService, public channelService: ChannelService) {
    Observable.merge(this.channelService.changed, this.channelService.message)
      .subscribe(() => {
        this.needScroll = true;
      })
  }

  ngAfterViewChecked(): void {
    if (this.needScroll) {
      this.scrollBottom();
      this.needScroll = false;
    }
  }

  scrollBottom () {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }

  trackByFn(index, item: IMessage) {
    return item.id;
  }
}
