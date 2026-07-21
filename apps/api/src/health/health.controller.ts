import { Controller, Get, HttpCode } from '@nestjs/common';

interface HealthResponse {
  status: 'ok';
  uptimeSeconds: number;
  timestamp: string;
}

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(200)
  check(): HealthResponse {
    return {
      status: 'ok',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
