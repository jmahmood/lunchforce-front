import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';


export function salesforceOnly(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const valid_email = control.value.toLowerCase().endsWith('salesforce.com');
    return !valid_email ? {'salesforceOnly': {value: control.value}} : null;
  };
}

@Directive({
  selector: '[appSalesforceOnly]',
  providers: [{provide: NG_VALIDATORS, useExisting: SalesforceOnlyDirective, multi: true}]

})
export class SalesforceOnlyDirective implements Validator {
  constructor() { }

  validate(control: AbstractControl): {[key: string]: any} {
    return (control.value !== null) ? salesforceOnly()(control) : null;
  }
}
