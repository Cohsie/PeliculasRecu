import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const AdminGuard: CanActivateFn = () => {
  const router = inject(Router);

  const idRol = localStorage.getItem('id_rol');

  if (idRol === '1') {
    return true;
  } else {
    router.navigate(['/films/list']);
    return false;
  }
};
