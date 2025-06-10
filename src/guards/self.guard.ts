import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AdminRoles } from 'src/enum';

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user, params } = context.switchToHttp().getRequest();

    if (user.role === AdminRoles.SUPERADMIN || user.id == params.id) {
      return true;
    }

    throw new ForbiddenException('Forbidden user');
  }
}
