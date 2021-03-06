import {Injectable} from '@angular/core';
import {Master} from '@app/core/models/master';
import {AuthenticationService} from '@app/core/services/authentication.service';
import {MasterManagerService} from '@app/core/services/master-manager.service';
import {UserManagerService} from '@app/core/services/user-manager.service';
import {ServicePublishStepFourComponent} from '@app/service/components/service-publish-step-four/service-publish-step-four.component';
import {StepFourDataInterface} from '@app/service/interfaces/step-four-data-interface';
import {ServicePublishDataHolderService} from '@app/service/services/service-publish-data-holder.service';

@Injectable()
export class ServicePublishAuthStateManagerService {

    constructor(
        private auth: AuthenticationService,
        private masterManager: MasterManagerService,
        private userManager: UserManagerService,
        private servicePublishDataHolder: ServicePublishDataHolderService
    ) {
    }

    public updateFourStepState(): void {
        if (!this.servicePublishDataHolder.isset(ServicePublishStepFourComponent.STEP)) {
            this.masterManager.isMaster().subscribe(
                isMaster => isMaster ? this.masterManager.getMasterList().subscribe(
                    masterList => this.update((masterList as Master[]).length === 0)
                ) : this.update(true)
            );
        }
    }

    private update(isNewMaster: boolean): void {
        this.userManager.getCurrentUser().subscribe(
            user => this.servicePublishDataHolder.setStepData<StepFourDataInterface>(
                ServicePublishStepFourComponent.STEP,
                {isNewMaster, user, isNewUser: false}
            )
        );
    }
}
