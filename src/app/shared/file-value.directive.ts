import { Directive, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[type=file]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: FileValueAccessor, multi: true },
  ],
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class FileValueAccessor implements ControlValueAccessor {
  value: any;
  @HostListener('change', ['$event.target.files'])
  onChange = (_: any) => {};

  @HostListener('blur')
  onTouched = () => {};

  writeValue(value: any) {
    // console.log(value);
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
