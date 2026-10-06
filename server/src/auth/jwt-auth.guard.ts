import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization || request.headers.Authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Permission denied. Authorization header with Bearer token is required.');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Permission denied. Invalid Authorization header format. Expected: Bearer <token>');
    }

    const payload = this.authService.verifyJwt(token);
    request.user = payload;
    return true;
  }
}
