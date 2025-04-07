import { Observable, tap } from "rxjs";
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { inject } from "@angular/core";

export const CanActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  console.log('CanActivate');
  console.log({route, state});

  return checkAuthStatus();
}

export const CanMatchGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  console.log('CanMatch');
  console.log({route, segments});

  return checkAuthStatus();
}

const checkAuthStatus = (): Observable<boolean> => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router)

  return authService.checkAuthentication()
      .pipe(
          tap( isAuthenticated => console.log('Autenticado:', isAuthenticated)),
          tap( isAuthenticated =>{
              if (!isAuthenticated){
                  router.navigate(['/auth/login']);
              }
          })
      )
}
