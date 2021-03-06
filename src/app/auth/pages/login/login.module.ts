import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {LoginFormComponent} from '@app/auth/components/login-form/login-form.component';
import {LoginFormService} from '@app/auth/forms/login-form.service';
import {TokenManagerService} from '@app/core/services/token-manager.service';
import {SharedModule} from '@app/shared/shared.module';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {LoginPageRoutingModule} from './login-routing.module';
import {LoginPage} from './login.page';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LoginPageRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateModule
    ],
    declarations: [
        LoginPage,
        LoginFormComponent
    ],
    providers: [
        TokenManagerService,
        LoginFormService
    ]
})
export class LoginPageModule {
}
