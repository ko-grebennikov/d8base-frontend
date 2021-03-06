import {fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {AuthResponseInterface} from '../../auth/interfaces/auth-response.interface';
import {StorageManagerService} from '../proxies/storage-manager.service';
import {TokenManagerService} from './token-manager.service';

describe('TokenManagerService', () => {

    const tokenData: AuthResponseInterface = {
        access_token: 'access_token',
        expires_in: 5,
        token_type: 'Baerer',
        scope: 'read write groups',
        refresh_token: 'refresh_token'
    };

    beforeEach(() => {
        TestBed.resetTestEnvironment();
        TestBed.initTestEnvironment(BrowserDynamicTestingModule,
            platformBrowserDynamicTesting());
    });

    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            {provide: StorageManagerService, useClass: StorageManagerMock}
        ]
    }));

    it('should be created', () => {
        const service: TokenManagerService = TestBed.inject(TokenManagerService);

        expect(service).toBeTruthy();
    });

    it('test #setTokens', (done) => {
        const service: TokenManagerService = TestBed.inject(TokenManagerService);

        service.setTokens(tokenData).then(
            _ => {
                (service as any).storage.get('api_token_data').then(token => {
                    expect(token).toEqual(tokenData);
                    done();
                });
            }
        );
    });

    it('test #getAccessToken',  (done) => {
        const service: TokenManagerService = TestBed.inject(TokenManagerService);

        service.setTokens(tokenData).then(
            _ => {
                service.getAccessToken().then(
                    token => {
                        expect(token).toEqual('access_token');
                        done();
                    }
                );
            }
        );
    });

    it('test #getRefreshToken',  (done) => {
        const service: TokenManagerService = TestBed.inject(TokenManagerService);

        service.setTokens(tokenData).then(
            _ => {
                service.getRefreshToken().then(
                    token => {
                        expect(token).toEqual('refresh_token');
                        done();
                    }
                );
            }
        );
    });

    it('test #clear',  (done) => {
        const service: TokenManagerService = TestBed.inject(TokenManagerService);

        service.setTokens(tokenData).then(
            _ => {
                service.clear().then(
                    () => {
                        service.getAccessToken().then(
                            token => {
                                expect(token).toBeUndefined();
                                done();
                            }
                        );
                        service.getRefreshToken().then(
                            token => {
                                expect(token).toBeUndefined();
                                done();
                            }
                        );
                    }
                );
            }
        );
    });

    it('test #isAccessTokenExpired', fakeAsync(() => {
        const service: TokenManagerService = TestBed.inject(TokenManagerService);

        service.setTokens(tokenData).then(
            _ => {
                tick(6000);
                service.isAccessTokenExpired().then(
                    bool => {
                        expect(bool).toBeTruthy();
                    }
                );
            }
        );
    }));

});

export class StorageManagerMock {

    private data: object = {
        api_token: null,
        refresh_token: null
    };

    public get(storageKey: string): Promise<any> {
        return Promise.resolve(this.data[storageKey]);
    }

    public set(storageKey: string, data: any): Promise<any> {
        this.data[storageKey] = data;

        return Promise.resolve(this.data[storageKey]);
    }

    public remove(storageKey: string): Promise<any> {
        this.data[storageKey] = null;

        return Promise.resolve();
    }
}
