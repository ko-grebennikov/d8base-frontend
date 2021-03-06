import {Component} from '@angular/core';
import {TranslationService} from '@app/core/services/translation.service';
import {City} from '@app/profile/models/city';
import {Country} from '@app/profile/models/country';
import {ServicePublishStepSevenFormFields} from '@app/service/enums/service-publish-step-seven-form-fields';
import {ServicePublishStepSevenFormService} from '@app/service/forms/service-publish-step-seven-form.service';
import {StepSevenDataInterface} from '@app/service/interfaces/step-seven-data-interface';
import {StepSevenDepartureDataInterface} from '@app/service/interfaces/step-seven-departure-data-interface';
import {ServicePublishAuthStateManagerService} from '@app/service/services/service-publish-auth-state-manager.service';
import {ServicePublishDataHolderService} from '@app/service/services/service-publish-data-holder.service';
import {ServiceStepsNavigationService} from '@app/service/services/service-steps-navigation.service';
import {Reinitable} from '@app/shared/abstract/reinitable';
import {SelectableCityOnSearchService} from '@app/shared/services/selectable-city-on-search.service';
import {SelectableCountryOnSearchService} from '@app/shared/services/selectable-country-on-search.service';
import {SelectablePostalCodeOnSearchService} from '@app/shared/services/selectable-postal-code-on-search.service';

@Component({
    selector: 'app-service-publish-step-seven',
    templateUrl: './service-publish-step-seven.component.html',
    styleUrls: ['./service-publish-step-seven.component.scss'],
})
export class ServicePublishStepSevenComponent extends Reinitable {

    public static readonly STEP = 6;
    public formFields = ServicePublishStepSevenFormFields;

    constructor(
        public formService: ServicePublishStepSevenFormService,
        public trans: TranslationService,
        public servicePublishDataHolderService: ServicePublishDataHolderService,
        public readonly countrySelectable: SelectableCountryOnSearchService,
        public readonly citySelectable: SelectableCityOnSearchService,
        public postalSelectable: SelectablePostalCodeOnSearchService,
        public serviceStepsNavigationService: ServiceStepsNavigationService,
        private authStateManager: ServicePublishAuthStateManagerService
    ) {
        super();
    }

    public submitForm(): void {
        this.servicePublishDataHolderService.assignStepData(ServicePublishStepSevenComponent.STEP, this.formService.form.getRawValue());
        this.serviceStepsNavigationService.next();
    }

    public onCountryChange(): void {
        this.formService.setControlDisabled(false, this.formFields.City);
    }

    public onCityChange(): void {
        this.formService.setControlDisabled(false, this.formFields.Postal);
    }

    public getCountryValue(): Country {
        return this.formService.getFormFieldValue(this.formFields.Country);
    }

    public getCityValue(): City {
        return this.formService.getFormFieldValue(this.formFields.City);
    }

    public getDepartureData(): StepSevenDepartureDataInterface {
        return this.servicePublishDataHolderService.getStepData<StepSevenDataInterface>(ServicePublishStepSevenComponent.STEP)?.departure;
    }

    public onThisPageDataChange(): void {
        this.servicePublishDataHolderService.assignStepData(ServicePublishStepSevenComponent.STEP, this.formService.form.getRawValue());
    }

    protected init(): void {
        this.authStateManager.updateFourStepState();
        if (this.servicePublishDataHolderService.isset(ServicePublishStepSevenComponent.STEP)) {
            this.formService.createForm(
                this.servicePublishDataHolderService.getStepData<StepSevenDataInterface>(ServicePublishStepSevenComponent.STEP)
            );
        } else {
            this.formService.createForm();
            this.formService.setControlDisabled(true, this.formFields.City);
            this.formService.setControlDisabled(true, this.formFields.Postal);
        }
    }
}
