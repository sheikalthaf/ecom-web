import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LogicalService {
  constructor() {}

  convertToFormData(data: Record<number, any>, files?: any[]): any {
    const formData = new FormData();
    const fullData = data;

    if (files?.[0]) {
      files?.forEach((key) => {
        const keyBU = key;
        key = key.replace(/~/, '');
        let dats = fullData[key];
        key = keyBU === key ? key : key + '[]';
        if (dats) {
          dats = Array.isArray(dats) ? dats : [dats];
          const newImages = [];
          for (const fileList of dats) {
            for (let i = 0; i < fileList.length; i++) {
              const fil = fileList[i];
              if (fil && typeof fil === 'object') {
                formData.append(`${key}${i}`, fil, fil.name);
                newImages.push(fil.name);
              }
            }
          }
          formData.append(key, newImages.join(','));
          delete fullData[key];
        }
      });
    }

    // eslint-disable-next-line guard-for-in
    for (const key in fullData) {
      const data1 = this.toISOString(fullData[key]);
      formData.append(key, data1);
    }

    return formData;
  }

  toISOString(date: any): string {
    // if (date instanceof moment) {
    //   const data123 = date as any;
    //   return data123.toISOString();
    // }
    return date;
  }
}
