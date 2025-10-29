import {HttpInterceptorFn} from "@angular/common/http";

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.warn('⚠️ Interceptor: No se encontró token');
  }

  return next(req);
};
