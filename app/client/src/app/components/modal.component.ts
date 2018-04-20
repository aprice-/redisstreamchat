/// <reference path='../../../node_modules/@types/jquery/index.d.ts'/>

import {Component, ElementRef, OnDestroy, AfterViewInit, ViewChild, Input} from '@angular/core';

import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html'
})
export class Modal implements AfterViewInit, OnDestroy
{
  @ViewChild('modalDiv') modalDiv: ElementRef;

  @Input() title: string;

  isVisible: boolean = false;

  el;

  destroy$ = new Subject<any>();

  @Input('confirm') confirmMode = false;

  ngAfterViewInit(): void {
    this.el = jQuery(this.modalDiv.nativeElement);
    this.el.modal({show: false});

    Observable.fromEvent(this.el, 'hidden.bs.modal')
      .takeUntil(this.destroy$)
      .subscribe(() => {
        this.isVisible = false;
      });

    Observable.fromEvent(this.el, 'shown.bs.modal')
      .takeUntil(this.destroy$)
      .subscribe(() => {
        this.isVisible = true;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  close () {
    if (this.isVisible) {
      this.isVisible = false;
      this.el.modal('hide');
    }
  }

  show()
  {
    if (!this.isVisible) {
      this.isVisible = true;
      this.el.modal('show');
    }
  }
}
