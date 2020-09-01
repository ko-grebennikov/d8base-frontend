import {Component, OnInit, SecurityContext} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {User} from '@app/core/models/user';
import {UserLocation} from '@app/core/models/user-location';
import {UserManagerService} from '@app/core/services/user-manager.service';
import {ProfileFormFields} from '@app/profile/enums/profile-form-fields';
import {ProfileService} from '@app/profile/services/profile.service';
import {Reinitable} from '@app/shared/abstract/reinitable';
import {ContactsAddComponent} from '@app/shared/components/contacts-add/contacts-add.component';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-main-info-tab',
    templateUrl: './main-info-tab.component.html',
    styleUrls: ['./main-info-tab.component.scss'],
})
export class MainInfoTabComponent extends Reinitable implements OnInit {

    public form: FormGroup;
    public formFields = ProfileFormFields;
    public defaultLocation$: BehaviorSubject<UserLocation> = new BehaviorSubject<UserLocation>(null);
    public additionalLocationsList$: BehaviorSubject<UserLocation[]> = new BehaviorSubject<UserLocation[]>([]);
    public user: User;

    constructor(
        public profileService: ProfileService,
        private sanitizer: DomSanitizer,
        private userManager: UserManagerService
    ) {
        super();
    }

    public ngOnInit(): void {
        this.profileService.createProfileForm$().subscribe(
            form => this.form = form
        );
        this.userManager.getCurrentUser().subscribe(
            user => this.user = user
        );
        this.profileService.createAvatarForm().subscribe(
            () => this.onAvatarChange()
        );
        this.profileService.initLocation().subscribe(
            locationList => {
                this.defaultLocation$.next(locationList.pop() as UserLocation);
                this.additionalLocationsList$.next(locationList as UserLocation[]);
            }
        );
        ContactsAddComponent.reinit$.next(true);
    }

// TODO: Is there best way for trim input values ?
    public submit(): void {
        // const user: User = plainToClass(User, this.form.getRawValue(), {excludeExtraneousValues: true});
        // user.birthday = user.birthday.slice(0, 10);
        // if (!this.form.controls[this.formFields.Avatar].dirty) {
        //     delete user.avatar;
        // }
        // this.profileService.updateUser(user);
    }

    public saveAvatar(data: string): void {
        if (data.slice(0, 7) !== 'http://' || data.slice(0, 8) !== 'https://') {
            this.profileService.updateUser({avatar: data});
        }
    }

    public getAvatar(): string | SafeResourceUrl {
        const avatar = this.profileService.avatarForm.get(ProfileFormFields.Avatar).value;
        if (null === avatar) {
            return 'assets/images/profile/noavatar.jpeg';
        }

        return this.sanitizer.sanitize(
            SecurityContext.RESOURCE_URL,
            this.sanitizer.bypassSecurityTrustResourceUrl(avatar)
        );
    }

    private onAvatarChange(): void {
        this.profileService.avatarForm.get(ProfileFormFields.Avatar).statusChanges.subscribe(
            _ => this.saveAvatar(this.profileService.avatarForm.get(ProfileFormFields.Avatar).value)
        );
    }
}
