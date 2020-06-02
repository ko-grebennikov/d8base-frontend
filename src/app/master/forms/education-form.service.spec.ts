import {TestBed} from '@angular/core/testing';

import {ReactiveFormsModule} from '@angular/forms';
import {EducationFormService} from './education-form.service';

describe('EducationFormService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            ReactiveFormsModule
        ],
        providers: [
            EducationFormService
        ]
    }));

    it('should be created', () => {
        const service: EducationFormService = TestBed.inject(EducationFormService);
        expect(service).toBeTruthy();
    });
});