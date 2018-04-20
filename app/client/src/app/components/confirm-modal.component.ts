
import {Component, EventEmitter, Output, Input, AfterViewInit} from '@angular/core';

import {Modal} from './modal.component';

import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'confirm-modal',
  templateUrl: './modal.component.html',
})
export class ConfirmModal extends Modal implements AfterViewInit
{
  @Output() cancel = new EventEmitter();
  @Output() confirm = new EventEmitter();

  @Input('confirmText') confirmText: string = 'Confirm';
  @Input('cancelText') cancelText: string = 'Cancel';

  confirmMode = true;

  result: boolean;

  destroy$ = new Subject<any>();

  constructor () {
    super();

    this.title = 'Confirm';
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    Observable.fromEvent(this.el, 'keyup')
      .takeUntil(this.destroy$)
      .subscribe((event: KeyboardEvent) => {
        if (event.keyCode === 13) {
          this.submitConfirm();
        }
      });

    Observable.fromEvent(this.el, 'hide.bs.modal')
      .takeUntil(this.destroy$)
      .subscribe(() => {
        if (!this.result) {
          this.result = false;
          this.cancel.emit();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  submitConfirm () {
    this.result = true;
    this.confirm.emit();
    this.close();
  }

  submitCancel () {
    this.result = false;
    this.cancel.emit();
    this.close();
  }
}
