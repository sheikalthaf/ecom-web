import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Pipe({
  standalone: true,
  name: 'image',
})
export class ImagePipe implements PipeTransform {
  transform(value?: string, ...args: any[]): any {
    const isThumbnail = args[0] || false;
    return value;
    // if (!value) return value;
    // return imageFn(value, isThumbnail);
  }
}

export function imageFn(value: string, isThumbnail: boolean = false) {
  if (value) {
    let url = [];
    if (!environment.production) {
      url.push(environment.api.replace('/api/', ''));
    }
    if (isThumbnail) {
      const splits = value.split('/');
      splits.splice(splits.length - 1, 0, 'thumbnails');
      value = splits.join('/');
    }
    url.push(value);
    return url.join('/');
  }
  return value;
}
