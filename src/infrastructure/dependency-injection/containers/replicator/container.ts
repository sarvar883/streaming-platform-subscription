import { Module } from '@nestjs/common';
import { AppModule } from '@services/replicator/app.module';
import { ReplicatorContainerModule } from './infrastructure';

@Module({
    imports: [...ReplicatorContainerModule, AppModule],
})
export class ReplicatorContainer {}