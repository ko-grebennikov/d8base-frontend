import {Injectable} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ServicePublishStepSevenTimetableFormFields} from '@app/service/enums/service-publish-step-seven-timetable-form-fields';
import {ServiceSchedule} from '@app/service/models/service-schedule';
import {plainToClass} from 'class-transformer';

// i'm so sorry
@Injectable()
export class ServicePublishStepSevenTimetableFormService {

    public form: FormGroup;
    public formArray: ServiceSchedule[] = [];
    public toDelete: ServiceSchedule[] = [];
    private defaultWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    constructor(private formBuilder: FormBuilder) {
    }

    public createForm(timetable?: ServiceSchedule[]): void {
        this.formArray = [];
        this.toDelete = [];
        this.form = this.formBuilder.group({
            timetable: this.formBuilder.array([])
        });
        timetable ? this.fillTimeTable(timetable) : this.fillDefaultTimeTable();

        return;
    }

    public isControlValid(control: string, index: number): boolean {
        return this.controls[index].controls[control].valid;
    }

    public updateIsEnabled(value: boolean, index: number): void {
        this.formArray[index].is_enabled = value;
    }

    public updateStartTime(value: string, index: number): void {
        this.formArray[index].start_time = value;
    }

    public updateEndTime(value: string, index: number): void {
        this.formArray[index].end_time = value;
    }

    get controls(): FormGroup[] {
        return (this.form.controls.timetable as FormArray).controls as FormGroup[];
    }

    public isSubmitDisabled(): boolean {
        return !(this.form.valid && this.form.dirty);
    }

    public pushDay(dayCode: number, startTime: string = null, endTime: string = null, isEnabled: boolean = false, id: number = null): void {
        (this.form.get(ServicePublishStepSevenTimetableFormFields.Timetable) as FormArray).push(
            this.getFormGroup(dayCode, startTime, endTime, isEnabled, id)
        );
    }

    public pushNewDay(dayCode: number): void {
        this.formArray.push(plainToClass(ServiceSchedule, {day_of_week: dayCode, end_time: null, start_time: null, is_enabled: false}));

        this.updateForm();
    }

    public fillDefaultTimeTable(): void {
        this.defaultWeek.forEach((dayCode, index) =>
            this.formArray.push(
                plainToClass(ServiceSchedule, {day_of_week: index, startTime: null, endTime: null, isEnabled: false, id: null})
            )
        );
        this.updateForm();
    }

    public unsetError(i: number): void {
        const endTimeValue = this.controls[i].controls[ServicePublishStepSevenTimetableFormFields.EndTime].value;
        this.controls[i].controls[ServicePublishStepSevenTimetableFormFields.EndTime].reset();
        this.controls[i].controls[ServicePublishStepSevenTimetableFormFields.EndTime].setValue(endTimeValue);
        const startTimeValue = this.controls[i].controls[ServicePublishStepSevenTimetableFormFields.StartTime].value;
        this.controls[i].controls[ServicePublishStepSevenTimetableFormFields.StartTime].reset();
        this.controls[i].controls[ServicePublishStepSevenTimetableFormFields.StartTime].setValue(startTimeValue);
    }

    public getDayByIndex(i: number): string {
        return this.defaultWeek[i];
    }

    public deleteDay(index: number): void {
        if (this.formArray[index].id) {
            this.toDelete.push(this.formArray[index]);
        }
        this.formArray.splice(index, 1);
        this.updateForm();
    }

    public checkOverlapValidity(index: number): any {
        const day = this.formArray[index];
        if (day.start_time && day.end_time) {
            this.formArray.forEach((value, idx) => {
                if ((index !== idx) && (day.day_of_week === value.day_of_week)) {
                    if ((day.is_enabled && value.is_enabled) &&
                        (value.start_time && value.end_time) &&
                        ((this.timeToInt(day.start_time) > this.timeToInt(value.start_time) &&
                            this.timeToInt(day.start_time) < this.timeToInt(value.end_time)) ||
                            (this.timeToInt(day.end_time) < this.timeToInt(value.end_time) &&
                                this.timeToInt(day.end_time) > this.timeToInt(value.start_time)))
                    ) {
                        this.controls[index].controls[ServicePublishStepSevenTimetableFormFields.EndTime].setErrors({overlaps: true});
                        this.controls[index].controls[ServicePublishStepSevenTimetableFormFields.StartTime].setErrors({overlaps: true});
                    } else if (
                        (this.controls[index].controls[ServicePublishStepSevenTimetableFormFields.EndTime].hasError('overlaps') ||
                            this.controls[index].controls[ServicePublishStepSevenTimetableFormFields.StartTime].hasError('overlaps')) &&
                        !this.controls[index].controls[ServicePublishStepSevenTimetableFormFields.StartTime].hasError('timeError') &&
                        !this.controls[index].controls[ServicePublishStepSevenTimetableFormFields.EndTime].hasError('timeError')
                    ) {
                        this.unsetError(index);
                    }
                }
            });
        }
    }

    private timeToInt(time: string): number {
        if (time.length !== 5) {
            throw Error('unexpected time string length');
        }

        return parseInt(time.slice(0, 2) + time.slice(3, 5), 10);
    }

    private updateForm(): void {
        (this.form.get(ServicePublishStepSevenTimetableFormFields.Timetable) as FormArray).clear();
        this.sort();
        this.formArray.forEach(data => this.pushDay(data.day_of_week, data.start_time, data.end_time, data.is_enabled, data.id));
    }

    private sort(): void {
        this.formArray = this.formArray?.sort((a, b) => a.day_of_week > b.day_of_week ? 1 : -1);
    }

    private fillTimeTable(timetable: ServiceSchedule[]): void {
        this.formArray = timetable;
        this.updateForm();
    }

    private getFormGroup(
        dayCode: number,
        startTime: string = null,
        endTime: string = null,
        isEnabled: boolean = false,
        id: number = null
    ): FormGroup {
        return this.formBuilder.group({
            [ServicePublishStepSevenTimetableFormFields.Day]: [dayCode],
            [ServicePublishStepSevenTimetableFormFields.StartTime]: [startTime],
            [ServicePublishStepSevenTimetableFormFields.EndTime]: [endTime],
            [ServicePublishStepSevenTimetableFormFields.IsEnabled]: [isEnabled],
            [ServicePublishStepSevenTimetableFormFields.Id]: [id]
        }, {
            validators: [
                this.startTimeValidator,
                this.endTimeValidator,
                this.startTimeFormatValidator,
                this.endTimeFormatValidator,
                this.timeIntervalValidator
            ]
        });
    }

    private timeIntervalValidator(group: FormGroup): any {
        if (!group.get(ServicePublishStepSevenTimetableFormFields.IsEnabled).value) {
            return;
        }
        const startTime = parseInt(
            (group.get(ServicePublishStepSevenTimetableFormFields.StartTime).value as string)?.slice(0, 2) +
            (group.get(ServicePublishStepSevenTimetableFormFields.StartTime).value as string)?.slice(3, 5),
            10
        );
        const endTimeTime = parseInt(
            (group.get(ServicePublishStepSevenTimetableFormFields.EndTime).value as string)?.slice(0, 2) +
            (group.get(ServicePublishStepSevenTimetableFormFields.EndTime).value as string)?.slice(3, 5),
            10
        );
        if (startTime >= endTimeTime) {
            group.get(ServicePublishStepSevenTimetableFormFields.EndTime).setErrors({timeError: true});
        }
    }

    private startTimeFormatValidator(group: FormGroup): any {
        if (group.get(ServicePublishStepSevenTimetableFormFields.IsEnabled).value &&
            ((group.get(ServicePublishStepSevenTimetableFormFields.StartTime).value as string)?.length !== 5 ||
                parseInt((group.get(ServicePublishStepSevenTimetableFormFields.StartTime).value as string)?.slice(0, 1), 10) > 2 ||
                parseInt((group.get(ServicePublishStepSevenTimetableFormFields.StartTime).value as string)?.slice(3, 5), 10) % 15 !== 0)
        ) {
            group.get(ServicePublishStepSevenTimetableFormFields.StartTime).setErrors({timeError: true});
        }
    }

    private endTimeFormatValidator(group: FormGroup): any {
        if (group.get(ServicePublishStepSevenTimetableFormFields.IsEnabled).value &&
            ((group.get(ServicePublishStepSevenTimetableFormFields.EndTime).value as string)?.length !== 5 ||
                parseInt((group.get(ServicePublishStepSevenTimetableFormFields.EndTime).value as string)?.slice(0, 1), 10) > 2 ||
                parseInt((group.get(ServicePublishStepSevenTimetableFormFields.EndTime).value as string)?.slice(3, 5), 10) % 15 !== 0)
        ) {
            group.get(ServicePublishStepSevenTimetableFormFields.EndTime).setErrors({timeError: true});
        }
    }

    private startTimeValidator(group: FormGroup): any {
        if (group.get(ServicePublishStepSevenTimetableFormFields.IsEnabled).value &&
            !group.get(ServicePublishStepSevenTimetableFormFields.StartTime).value) {
            group.get(ServicePublishStepSevenTimetableFormFields.StartTime).setErrors({timeError: true});
        }
    }

    private endTimeValidator(group: FormGroup): any {
        if (group.get(ServicePublishStepSevenTimetableFormFields.IsEnabled).value &&
            !group.get(ServicePublishStepSevenTimetableFormFields.EndTime).value) {
            group.get(ServicePublishStepSevenTimetableFormFields.EndTime).setErrors({timeError: true});
        }
    }
}
