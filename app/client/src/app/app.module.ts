
import 'rxjs/Rx';

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {ApiService, UserNameInterceptor} from './services/api.service';
import {UserNameService} from './services/user-name.service';
import {ChannelService} from './services/channel.service';

import {AppComponent} from './app.component';
import {ChannelWindowComponent} from './components/channel-window.component';
import {ChannelTabsComponent} from './components/channel-tabs.component';
import {ChannelMembersComponent} from './components/channel-members.component';
import {ConfirmModal} from './components/confirm-modal.component';
import {Modal} from './components/modal.component';
import {ChannelInputComponent} from './components/channel-input.component';
import {HumanRelativeDatePipe} from './pipes/human-relative-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HumanRelativeDatePipe,
    Modal,
    ConfirmModal,
    ChannelWindowComponent,
    ChannelTabsComponent,
    ChannelMembersComponent,
    ChannelInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    ApiService,
    UserNameService,
    ChannelService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserNameInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
