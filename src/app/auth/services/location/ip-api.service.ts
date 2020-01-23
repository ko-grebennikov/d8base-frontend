import {Injectable} from '@angular/core';
import {IpServiceInterface} from '../../interfaces/location/ip-service.interface';
import {IpDataInterface} from '../../interfaces/location/ip-data.interface';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {IpApiResponseInterface} from '../../interfaces/location/ip-api-response.interface';

@Injectable()
export class IpApiService implements IpServiceInterface {

    private readonly url = 'https://ipapi.co/json/';

    constructor(private http: HttpClient) {
    }

    public getData(): Promise<IpDataInterface> {
        return new Promise((resolve, reject) => {
            this.http.get(this.url)
                .pipe(
                    tap((res: IpApiResponseInterface) => {
                        if (res.error) {
                            reject(res);
                        }
                    }),
                ).subscribe(
                (res: IpApiResponseInterface) => {
                    try {
                        resolve({
                            ip: res.ip,
                            postal_code: res.postal,
                            country_code: res.country
                        });
                    } catch (e) {
                        reject(e);
                    }
                },
                error => reject(error)
            );
        });
    }
}