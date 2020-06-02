import { Injectable } from '@angular/core';
import {ApiListResponseInterface} from '@app/core/interfaces/api-list-response.interface';
import {ApiClientService} from '@app/core/services/api-client.service';
import {Experience} from '@app/master/models/experience';
import {plainToClass} from 'class-transformer';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable()
export class ExperienceApiService {

    private readonly url = environment.backend.experience;

    constructor(private client: ApiClientService) { }

    public get(masterId: number): Observable<ApiListResponseInterface<Experience>> {
        return this.client.get(this.url, {professional: masterId.toString(10)}).pipe(
            map((raw: ApiListResponseInterface<Experience>) => {
                raw.results = plainToClass(Experience, raw.results);

                return raw;
            })
        );
    }

    public create(experiences: Experience[]): Observable<Experience[]> {
        return this.client.postList<Experience>(experiences, this.url).pipe(
            map(raw => plainToClass(Experience, raw))
        );
    }

    public update(experiences: Experience[]): Observable<Experience[]> {
        return this.client.putList<Experience>(experiences, this.url).pipe(
            map(raw => plainToClass(Experience, raw))
        );
    }

    public delete(experiences: Experience[]): Observable<Experience[]> {
        return this.client.deleteList<Experience>(experiences, this.url);
    }
}