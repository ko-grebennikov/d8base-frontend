import {Injectable} from '@angular/core';
import {AbstractApiService} from '@app/core/abstract/abstract-api.service';
import {ApiListResponseInterface} from '@app/core/interfaces/api-list-response.interface';
import {ApiServiceInterface} from '@app/core/interfaces/api-service-interface';
import {ApiClientService} from '@app/core/services/api-client.service';
import {Education} from '@app/master/models/education';
import {plainToClass} from 'class-transformer';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable()
export class EducationApiService extends AbstractApiService<Education> implements ApiServiceInterface<Education> {

    private readonly url = environment.backend.education;

    constructor(protected client: ApiClientService) {
        super(client);
    }

    public getByMasterId(masterId: number): Observable<ApiListResponseInterface<Education>> {
        return super.get({professional: masterId?.toString(10)});
    }

    protected getUrl(): string {
        return this.url;
    }

    // @ts-ignore
    protected transform(data: Education | Education[]): Education | Education[] {
        return plainToClass(Education, data);
    }

}
