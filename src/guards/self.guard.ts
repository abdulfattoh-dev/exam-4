import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AdminRoles } from '../enum/index';

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user, params } = ctx.switchToHttp().getRequest();
    if (user.role === AdminRoles.SUPERADMIN) {
      return true;
    }
    if (user.role === AdminRoles.ADMIN && user.id === Number(params.id)) {
      return true;
    }
    throw new ForbiddenException(`Forbidden user with role ${user.role}`);
  }
}