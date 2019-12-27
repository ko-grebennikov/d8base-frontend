import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegistrationFormComponent } from './registration-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {ErrorFlashbagComponent} from '../../../../shared/components/error-flashbag/error-flashbag.component';
import {RegistrationFormService} from '../../forms/registration-form.service';
import {RegistrationFormFields} from '../../enums/registration-form-fields';
import {UserModel} from '../../../../shared/models/user.model';

describe('RegistrationFormComponent', () => {
  let component: RegistrationFormComponent;
  let fixture: ComponentFixture<RegistrationFormComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationFormComponent, ErrorFlashbagComponent ],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, FormsModule, RouterTestingModule],
      providers: [RegistrationFormService]
    }).compileComponents();

    router = TestBed.get(Router);
    spyOn(router, 'navigateByUrl');

    fixture = TestBed.createComponent(RegistrationFormComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('test submit registration form', () => {
    const email = (component as any).registrationFormService.form.controls[RegistrationFormFields.Email];
    const pwd = (component as any).registrationFormService.form.controls[RegistrationFormFields.Password];

    email.setValue('test@test.te');
    pwd.setValue('test');

    spyOn((component as any).user, 'emit');

    fixture.debugElement.nativeElement.querySelector('ion-button').click();

    const user = new UserModel();
    user.email = 'test@test.te';
    user.password = 'test';
    user.name = null;
    user.phone = null;
    user.country = null;
    user.city = null;

    expect((component as any).user.emit).toHaveBeenCalledWith(user);
  });
});