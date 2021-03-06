import {ClientContactInterface} from '@app/shared/interfaces/client-contact-interface';
import {Expose} from 'class-transformer';

// tslint:disable:variable-name
export class MasterContact implements ClientContactInterface {
    @Expose() public id: number;
    @Expose() public professional?: number;
    @Expose() public contact: number;
    @Expose() public contact_code?: string;
    @Expose() public contact_display?: string;
    @Expose() public value?: string;
}
