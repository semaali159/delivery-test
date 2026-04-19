import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  
  @Injectable()
  export class PartnerApiKeyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
      const key = req.headers['x-partner-api-key'];
      if (!key || key !== process.env.PARTNER_API_KEY) {
        throw new UnauthorizedException('Invalid partner API key');
      }
      return true;
    }
  }