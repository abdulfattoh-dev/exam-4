import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRoles, AdminRoles } from '../enum/index';

@Injectable()
export class SellerGuard implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user, params } = ctx.switchToHttp().getRequest();
    if (user.role === AdminRoles.SUPERADMIN || user.role === AdminRoles.ADMIN) {
      return true;
    }
    if (user.role === UserRoles.SELLER && user.id === Number(params.id)) {
      return true;
    }
    throw new ForbiddenException(`Forbidden user with role ${user.role}`);
  }
}