import { Module } from '@nestjs/common';
import { AppModule } from '@services/api/app.module';
import { ApiInfrastructureModule } from './infrastructure';

@Module({
    imports: [...ApiInfrastructureModule, AppModule],
})
export class ContainerApi {}