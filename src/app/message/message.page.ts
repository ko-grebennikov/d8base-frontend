import {Component, OnInit} from '@angular/core';
import {MessageInterface} from '@app/message/interfaces/message-interface';

@Component({
    selector: 'app-message',
    templateUrl: './message.page.html',
    styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {

    public messages: MessageInterface[];

    constructor() {
    }

    ngOnInit() {
    }

}
