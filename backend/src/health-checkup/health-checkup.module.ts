import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheckupService } from './health-checkup.service';
import { HealthCheckupController } from './health-checkup.controller';
import { HealthCheckup } from './entities/health-checkup.entity';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HealthCheckup]),
    AiModule,
  ],
  controllers: [HealthCheckupController],
  providers: [HealthCheckupService],
  exports: [HealthCheckupService],
})
export class HealthCheckupModule {}
