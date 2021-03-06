import {Injectable} from '@angular/core';
import {AbstractApiService} from '@app/core/abstract/abstract-api.service';
import {ApiListResponseInterface} from '@app/core/interfaces/api-list-response.interface';
import {ApiServiceInterface} from '@app/core/interfaces/api-service-interface';
import {ApiClientService} from '@app/core/services/api-client.service';
import {MasterLocation} from '@app/master/models/master-location';
import {LocationApiServiceInterface} from '@app/shared/interfaces/location-api-service-interface';
import {plainToClass} from 'class-transformer';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MasterLocationApiService extends AbstractApiService<MasterLocation>
    implements LocationApiServiceInterface, ApiServiceInterface<MasterLocation> {

    private readonly url = environment.backend.professional_location;

    constructor(private client: ApiClientService) {
        super(client);
    }

    public getByClientId(clientId?: number): Observable<ApiListResponseInterface<MasterLocation>> {
        return super.get({professional: clientId?.toString(10)});
    }

    public getTimeZoneList(): Observable<Array<{ value: string, display_name: string }>> {
        return this.client.options(this.url).pipe(
            map((raw: { actions: { POST: { timezone: { choices: Array<{ value: string, display_name: string }> } } } }) =>
                raw.actions.POST.timezone.choices)
        );
    }

    protected getUrl(): string {
        return this.url;
    }

    // @ts-ignore
    protected transform(data: MasterLocation | MasterLocation[]): MasterLocation | MasterLocation[] {
        return plainToClass(MasterLocation, data);
    }
}
