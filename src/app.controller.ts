import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller()
export class AppController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('aggregated/:id')
  async getAggregatedData(@Param('id') id: string) {
    return this.databaseService.getAggregatedData(id);
  }

  @Get('payouts')
  async getRequestedPayouts(): Promise<{ id: string; amount: number }[]> {
    return this.databaseService.getRequestedPayouts();
  }
}
