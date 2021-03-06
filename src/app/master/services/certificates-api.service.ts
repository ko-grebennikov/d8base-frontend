import { Injectable } from '@angular/core';
import {AbstractApiService} from '@app/core/abstract/abstract-api.service';
import {ApiListResponseInterface} from '@app/core/interfaces/api-list-response.interface';
import {ApiServiceInterface} from '@app/core/interfaces/api-service-interface';
import {ApiClientService} from '@app/core/services/api-client.service';
import {Certificate} from '@app/master/models/certificate';
import {plainToClass} from 'class-transformer';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable()
export class CertificatesApiService extends AbstractApiService<Certificate> implements ApiServiceInterface<Certificate> {

    private readonly url = environment.backend.certificates;

    constructor(protected client: ApiClientService) {
        super(client);
    }

    public getByMasterId(masterId: number): Observable<ApiListResponseInterface<Certificate>> {
        return super.get({professional: masterId?.toString(10)});
    }

    protected getUrl(): string {
        return this.url;
    }

    // @ts-ignore
    protected transform(data: Certificate | Certificate[]): Certificate | Certificate[] {
        return plainToClass(Certificate, data);
    }
}
