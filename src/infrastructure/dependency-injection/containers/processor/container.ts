import { Module } from '@nestjs/common';
import { AppModule } from '@services/processor/app.module';
import { ProcessorInfrastructureModule } from './infrastructure';

@Module({
    imports: [...ProcessorInfrastructureModule, AppModule],
})
export class ProcessorContainer {}