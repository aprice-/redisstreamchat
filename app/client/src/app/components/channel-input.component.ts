
import {Component} from '@angular/core';
import {UserNameService} from '../services/user-name.service';
import {ChannelService} from '../services/channel.service';

@Component({
  selector: 'channel-input',
  template: `<form (keydown)="keydown($event)"><input type="text" [(ngModel)]="input" name="input" class="form-control" /></form>`
})
export class ChannelInputComponent {

  input: string;

  constructor (public userNameService: UserNameService, public channelService: ChannelService) {
  }

  submit () {

    let input = this.input;
    this.input = '';

    if (input.trim() === "") {
      return;
    }

    if (input.indexOf('/') === 0) {
      let args = input.substr(1).split(' ');
      if (args[0] === 'j' || args[0] === 'join') {
        if (args.length > 1) {
          let channel = args[1];
          this.channelService.join(channel);
        }
      }
      if (args[0] === 'p' || args[0] === 'part') {
        if (args.length > 1) {
          let channelName = args[1];
          this.channelService.part(channelName);
        } else if (this.channelService.current) {
          this.channelService.part(this.channelService.current.name);
        }
      }
      if (args[0] === 'me') {
        if (this.channelService.current) {
          this.channelService.current.send(input).subscribe(() => {});
        }
      }
    }
    else if (this.channelService.current) {
      this.channelService.current.send(input).subscribe(() => {});
    }
  }

  keydown(event) {
    if(event.keyCode == 13) {
      this.submit();
    }
    if (event.keyCode == 9) {
      this.autocompleteMembers();
      event.preventDefault();
    }
  }

  autocompleteMembers () {
    let parts = this.input.split(' ');
    if (parts.length > 0) {
      let lastWord = parts[parts.length - 1];

      if (this.channelService.current) {
        let match = this.channelService.current.members.find(member => member.indexOf(lastWord) === 0);
        if (match) {
          this.input = parts.slice(0, -1).concat([match]).join(" ")
        }
      }
    }
  }
}
