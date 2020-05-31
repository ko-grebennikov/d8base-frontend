import {ClientLocationInterface} from '@app/shared/interfaces/client-location-interface';
import {Expose} from 'class-transformer';

export class UserLocation implements ClientLocationInterface  {
    @Expose() public id: number;
    @Expose() public country?: number;
    @Expose() public region?: number;
    @Expose() public subregion?: number;
    @Expose() public city: number;
    @Expose() public district: number;
    @Expose() public postal_code: number;
    @Expose() public address: string;
    @Expose() public coordinates: {
        type: string,
        coordinates: number[]
    };
    @Expose() public units: number;
    @Expose() public timezone: string;
    @Expose() public is_default: boolean;
}
