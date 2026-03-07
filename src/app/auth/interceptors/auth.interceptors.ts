import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";


// export function authInterceptor(
//     req: HttpRequest<unknown>,
//     next: HttpHandlerFn) {
//   const token = inject(AuthService).token();
//   console.log({token})
//   const newReq = req.clone({
//     headers: req.headers.append('Authorization', `Bearer ${ token }`),
//   });
//   return next(newReq);
// }

// export function authInterceptor(
//   req: HttpRequest<unknown>,
//   next: HttpHandlerFn
// ) {
//   const token = inject(AuthService).token();

//   // URLs donde NO quiero enviar token
//   const urlsSinToken = [
//     '/auth/login',
//     '/auth/register',
//     // '/products'
//   ];
//   // Si la URL incluye alguna de las rutas excluidas → NO agrega token
//   if (urlsSinToken.some(url => req.url.includes(url))) {
//     return next(req);
//   }

//   // Si pasa el filtro → agregar token
//   const newReq = req.clone({
//     headers: req.headers.append('Authorization', `Bearer ${token}`),
//   });

//   //console.log('funcionando en authsesion' + req.url);
//   return next(newReq);
// }


export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const token = inject(AuthService).token();

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });
  return next(newReq);
}