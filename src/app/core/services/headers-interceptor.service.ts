import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from, Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {TokenManagerService} from '@app/core/services/token-manager.service';
import {AuthenticationService} from '@app/core/services/authentication.service';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    constructor(private tokenManager: TokenManagerService, private auth: AuthenticationService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.tokenManager.getAccessToken())
            .pipe(
                switchMap(token => {
                    let headers;
                    if (null === token) {
                        headers = req.headers
                            .append('Content-Type', 'application/json');
                    } else {
                        headers = req.headers
                            .set('Authorization', 'Bearer ' + token)
                            .append('Content-Type', 'application/json');
                    }
                    const requestClone = req.clone({
                        headers
                    });

                    return next.handle(requestClone);
                })
            );
    }
}