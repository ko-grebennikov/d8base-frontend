import {Injectable} from '@angular/core';
import {ApiListResponseInterface} from '@app/core/interfaces/api-list-response.interface';
import {MasterInterface} from '@app/core/interfaces/master.interface';
import {Master} from '@app/core/models/master';
import {User} from '@app/core/models/user';
import {ApiClientService} from '@app/core/services/api-client.service';
import {AuthenticationService} from '@app/core/services/authentication.service';
import {UserManagerService} from '@app/core/services/user-manager.service';
import {TypeOfUser} from '@app/profile/enums/type-of-user';
import {plainToClass} from 'class-transformer';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MasterManagerService {

    public isMaster$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private readonly url = environment.backend.master;
    private readonly masterListUrl = environment.backend.master_list;

    constructor(private client: ApiClientService, private userManager: UserManagerService, private auth: AuthenticationService) {
    }

    public subscribeToAuth(): void {
        this.auth.isAuthenticated$.subscribe(isAuth => isAuth ? this.updateIsMaster() : this.isMaster$.next(false));
    }

    public updateIsMaster(): void {
        this.isMaster().subscribe(isMaster => this.isMaster$.next(isMaster));
    }

    public isMaster(): Observable<boolean> {
        return this.userManager.getCurrentUser().pipe(map(user => user.account_type === TypeOfUser.Master));
    }

    public becomeMaster(): Observable<User> {
        return this.userManager.becomeMaster().pipe(tap(_ => this.updateIsMaster()));
    }

    public getMasterList(): Observable<Master[]> {
        return this.client.get(this.url).pipe(map((data: ApiListResponseInterface<Master>) => data.results));
    }

    public updateMaster(master: Master): Observable<Master> {
        return this.client.put(`${this.url}${master.id}/`, master).pipe(map(raw => plainToClass(Master, raw)));
    }

    public createMaster(master: Master): Observable<Master> {
        return this.client.post(this.url, master).pipe(map(raw => plainToClass(Master, raw)));
    }

    public getMaster(masterId?: number): Observable<Master> {
        return this.client.get(`${this.url}${masterId}/`).pipe(map(raw => plainToClass(Master, raw)));
    }

    public getUserLessList$(ids: number[]): Observable<MasterInterface[]> {
        return this.client
            .get<ApiListResponseInterface<MasterInterface>>(this.masterListUrl, {pk_in: ids.join(',')})
            .pipe(map((data) => data.results));
    }

    public getExperienceLevelList(): Observable<{ value: string, display_name: string }[]> {
        return this.client.options(this.url).pipe(
            map((data: { actions: { POST: { level: { choices: { value: string, display_name: string }[] } } } }) =>
                data.actions.POST.level.choices)
        );
    }
}
