import {IMessage} from './message';
import {ChannelService} from './channel.service';
import {ApiService} from './api.service';
import {StreamId} from './stream-id';

export class Channel {
  messages: IMessage[] = [];
  members: string[];

  latestSeenId: string;
  messageIds = new Set<string>();

  constructor (private channelService: ChannelService, private api: ApiService, public name: string) {

    this.getMembers().subscribe(() => {});

    this.channelService.message
      .filter(message => message.channel === this.name)
      .subscribe(message => {
        this.messages.push(message);
        if (message.join || message.part) {
          this.getMembers().subscribe(() => {});
        }
        if (this.channelService.current == this) {
          this.latestSeenId = message.id;
        }
      });

    this.channelService.changed
      .filter(channel => channel === this)
      .subscribe(() => {
        if (this.messages.length > 0) {
          this.latestSeenId = this.messages[this.messages.length - 1].id;
        }
      });

    this.getMessages().subscribe(() => {});
  }

  private getMessages (before?: string) {
    return this.api.getMessages(this.name, before).do(messages => {
      for (let message of messages) {
        if (!this.messageIds[message.id]) {
          let targetIndex = 0;
          this.messages.some((m, index) => {
            if (m.id < message.id) {
              targetIndex = index;
            }
            return m.id > message.id;
          });
          this.messages.splice(targetIndex, 0, message);
        }
      }
    })
  }

  private getMembers () {
    return this.api.getMembers(this.name).do(members => {
      this.members = members;
    })
  }

  loadMoreHistory () {
    if (this.messages.length > 0) {
      let first = this.messages[0];
      let beforeFirst = StreamId.parse(first.id).decrement().toString();
      return this.getMessages(beforeFirst).subscribe(() => {});
    }
  }

  send (message: string) {
    return this.api.send(this.name, message);
  }
}
