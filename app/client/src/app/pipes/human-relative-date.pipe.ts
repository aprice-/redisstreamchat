import {Pipe, PipeTransform} from '@angular/core';

import * as moment from 'moment';

@Pipe({name: 'humanRelativeDate'})
export class HumanRelativeDatePipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      let timestamp = +value.substring(0, value.indexOf('-'));
      let now = Date.now();
      if (timestamp > now) {
        timestamp = now;
      }
      return moment(timestamp).fromNow();
    } else {
      return '';
    }
  }
}
