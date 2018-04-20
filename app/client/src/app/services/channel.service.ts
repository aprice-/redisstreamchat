
import * as io from "socket.io-client";

import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Channel} from './channel';
import {IMessage} from './message';

@Injectable()
export class ChannelService {

  readonly storageKey = 'channels';

  changed = new ReplaySubject<Channel>();
  current: Channel;
  channels: Channel[] = [];

  socket = io.connect({path: '/api/socket.io'}); // connect the web socket
  message = Observable.fromEvent<IMessage>(this.socket, 'message'); // socket received messages
  reconnect = Observable.fromEvent(this.socket, 'reconnect'); // socket reconnections

  constructor (private api: ApiService) {
    this.load();
    this.reconnect.subscribe(() => {
      for (let channel of this.channels) {
        this.socket.emit('join', channel.name); // tell the server a channel was joined
      }
    });
  }

  join (channelName: string) {
    let channel = this.channels.find(x => x.name === channelName);
    if (channel) {
      this.change(channelName);
      return Observable.empty();
    }
    this.api.join(channelName)
      .subscribe(() => {
        this.addChannel(channelName);
        this.change(channelName);
        this.save();
      });
  }

  part (channelName: string) {
    this.api.part(channelName)
      .subscribe(() => {
        this.removeChannel(channelName);
        this.save();

        if (this.channels.length > 0) {
          this.change(this.channels[0].name);
        } else {
          this.change(null);
        }
      });
  }

  change (channelName: string) {
    let channel = this.channels.find(x => x.name === channelName);
    if (channel != this.current) {
      this.current = channel;
      this.changed.next(this.current);
    }
  }

  private addChannel(name: string): Channel {
    let channel = new Channel(this, this.api, name);
    this.channels.push(channel);
    this.socket.emit('join', channel.name); // tell the server a channel was joined
    return channel;
  }

  private removeChannel (name: string) {
    let channelIndex = this.channels.findIndex(c => c.name === name);
    if (channelIndex > -1) {
      this.channels.splice(channelIndex, 1);
      this.socket.emit('part', name); // tell the server a channel was left
    }
  }

  private save () {
    localStorage.setItem(this.storageKey, JSON.stringify(this.channels.map(x => x.name)))
  }

  private load () {
    let channelsJson = localStorage.getItem(this.storageKey);
    if (channelsJson) {
      let channels: string[] = JSON.parse(channelsJson);
      if (channels.length > 0) {
        Observable.from(channels)
          .map(channel => this.addChannel(channel))
          .last()
          .do(channel => this.change(channel.name))
          .subscribe(() => {})
      }
    }
  }
}

