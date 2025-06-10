import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError } from 'src/utils/catch-error';

export const GetCookie = createParamDecorator(
  async (key: string, context: ExecutionContext) => {
    try {
      const req = context.switchToHttp().getRequest();
      const refreshToken = req.cookies[key];

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token expired');
      }

      return refreshToken;
    } catch (error) {
      return catchError(error);
    }
  },
);
