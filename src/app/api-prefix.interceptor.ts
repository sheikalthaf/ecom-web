import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment.development';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({ url: `${environment.api}${req.url}` });
  return next(apiReq);
}
