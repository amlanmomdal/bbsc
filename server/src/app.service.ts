import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { status: string; service: string; timestamp: string } {
    return {
      status: 'online',
      service: 'Burul Blue Star Club (BBSC) NestJS API Server',
      timestamp: new Date().toISOString(),
    };
  }
}
