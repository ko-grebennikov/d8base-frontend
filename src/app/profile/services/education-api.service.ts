import {Injectable} from '@angular/core';
import {ApiClientService} from '@app/core/services/api-client.service';
import {environment} from '../../../environments/environment';
import {Education} from '@app/profile/models/education';
import {Observable} from 'rxjs';
import {UserManagerService} from '@app/core/services/user-manager.service';
import {plainToClass} from 'class-transformer';
import {map, switchMap} from 'rxjs/operators';
import {Master} from '@app/shared/models/master';

@Injectable()
export class EducationApiService {

    private readonly url = environment.backend.education;

    constructor(private client: ApiClientService, private userManager: UserManagerService) {
    }

    public getCurrentUserEducation(education: Education): Observable<Education> {
        return this.userManager.getCurrentUser().pipe(
            switchMap((master: Master) => this.get(master.id))
        );
    }

    public get(masterId: number): Observable<Education> {
        return this.client.get(`${this.url}/${masterId}`).pipe(
            map(raw => plainToClass(Education, raw))
        );
    }

    public save(education: Education): Observable<Education> {
        return this.client.post(this.url).pipe(
            map(raw => plainToClass(Education, raw))
        );
    }
}