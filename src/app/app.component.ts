import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AuthenticationFactory} from '@app/core/services/authentication-factory.service';
import {DarkModeService} from '@app/core/services/dark-mode.service';
import {UserLocationApiService} from '@app/core/services/location/user-location-api.service';
import {MasterManagerService} from '@app/core/services/master-manager.service';
import {PusherService} from '@app/core/services/pusher.service';
import {TranslationService} from '@app/core/services/translation.service';
import {Country} from '@app/profile/models/country';
import {CountriesApiService} from '@app/profile/services/countries-api.service';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {MenuController, Platform} from '@ionic/angular';
import {Observable} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    public darkTheme = false;
    public newMessages: boolean = false;
    public countryCode: string;

    constructor(
        public readonly platform: Platform,
        private readonly splashScreen: SplashScreen,
        private readonly statusBar: StatusBar,
        private readonly darkModeService: DarkModeService,
        private readonly titleService: Title,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        public readonly trans: TranslationService,
        public readonly menu: MenuController,
        public readonly authenticationFactory: AuthenticationFactory,
        public readonly masterManager: MasterManagerService,
        public readonly userLocationApi: UserLocationApiService,
        public readonly countryApi: CountriesApiService,
        private readonly pusher: PusherService
    ) {
        this.initializeApp();
    }

// https://blog.bitsrc.io/dynamic-page-titles-in-angular-98ce20b5c334
    public ngOnInit(): void {
        const appTitle = this.titleService.getTitle();
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(_ => {
                let child = this.activatedRoute.firstChild;
                while (child.firstChild) {
                    child = child.firstChild;
                }
                if (child.snapshot.data.title) {
                    return child.snapshot.data.title;
                }

                return appTitle;
            })
        ).subscribe((title: string) => this.titleService.setTitle(title));
        this.getDefaultUserCountry().subscribe(c => this.countryCode = c.code.toLowerCase());
    }

    public initializeApp(): void {
        /** TODO: Why code duplicate? */
        /** @see AppInitService.init */
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.initDarkMode();
            this.toggleMenu();
            // Temporary disabled. Do not remove!
            // this.pusher.requestPushPermission();
        });
    }

    public toggleMenu(): void {
        const splitPane = document.querySelector('ion-split-pane');
        const windowWidth = window.innerWidth;
        const splitPaneShownAt = 992;
        const menu = splitPane.querySelector('ion-menu');
        if (windowWidth >= splitPaneShownAt) {
            splitPane.disabled = !splitPane.disabled;
            menu.disabled = !menu.disabled;
        }
    }

    public becomeMaster(): void {
        this.masterManager.becomeMaster().subscribe();
    }

    public changeMode(data: any): void {
        this.darkTheme = data.target.checked;
        this.darkModeService.setMode(data.target.checked);
    }

    public getTitle(): string {
        return this.titleService.getTitle();
    }

    public async logout(): Promise<void> {
        await this.authenticationFactory.getAuthenticator().logout();
        this.masterManager.updateIsMaster();
        this.authenticationFactory.getAuthenticator().getIsAuthenticatedSubject().next(false);
        this.router.navigateByUrl('/auth/login');
    }

    private getDefaultUserCountry(): Observable<Country> {
        return this.userLocationApi.getDefaultLocation().pipe(
            switchMap(location => this.countryApi.getByEntityId(location.country as number))
        );
    }

    private initDarkMode(): void {
        this.darkModeService.isDarkMode().then((data: boolean) => this.darkTheme = data);
    }
}
