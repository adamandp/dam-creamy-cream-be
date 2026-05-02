import { Injectable } from '@nestjs/common';
import {
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'src/common/prisma.module';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  healthCheck(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.http.pingCheck('google', 'https://google.com'),
    ]);
  }

  dbCheck() {
    return this.prismaHealth.pingCheck('db', this.prisma);
  }
}
