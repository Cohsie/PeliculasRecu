import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';



export const PublicGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthentication().pipe(
    tap((isAuthenticated: boolean) => {
      if(isAuthenticated){
        router.navigate(['/films']);
      }
    }),
    map((isAuthenticated: boolean) => !isAuthenticated)
  );
};
