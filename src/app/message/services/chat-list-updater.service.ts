import {Injectable} from '@angular/core';
import {NotificationWorkerService} from '@app/core/services/notification-worker.service';
import {AbstractMessage} from '@app/message/models/abstract-message';
import {ChatsCompilerService} from '@app/message/services/chats-compiler.service';
import {from, Observable} from 'rxjs';
import {filter, switchMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import Timer = NodeJS.Timer;

@Injectable()
export class ChatListUpdaterService {

    private timer: Timer;
    private readonly updateInterval: number = environment.message.chat_list_update_interval_ms;

    constructor(private chatsCompilerService: ChatsCompilerService, private notificationWorker: NotificationWorkerService) {
    }

    public receiveUpdates(): Observable<AbstractMessage[]> {
        this.destroy();

        return NotificationWorkerService.isFirebaseSupported() ? this.notificationWorker.messageReceived$.pipe(
            filter(received => received),
            switchMap(() => this.getChatList())
        ) : new Observable<AbstractMessage[]>(
            subscriber => {
                this.timer = setInterval(() => this.chatsCompilerService.generateChatList().then(
                    (chatList: AbstractMessage[]) => subscriber.next(chatList)
                ), this.updateInterval);
            }
        );
    }

    public getChatList(): Observable<AbstractMessage[]> {
        return from(this.chatsCompilerService.generateChatList());
    }

    public destroy(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
