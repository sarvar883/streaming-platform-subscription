import { EventPatternConfig } from '@payme/nestjs-communication-utils';
import { Controller, Inject } from '@nestjs/common';
import { Payload, Transport } from '@nestjs/microservices';
import { KafkaTopics } from '@infrastructure/config/impl/general/general.config.schema';
import { Symbols } from '@di/common';

import { EventHandleUseCase } from '@useCases/replicator/eventHandle';
import { EventPayload, EventHandleUseCaseInput } from '@infrastructure/controllers/replicator';
import { Instruction } from '@domain/task';


@Controller()
export class ReplicatorEventController {
    constructor(
        @Inject(Symbols.useCases.EventHandle) private readonly eventHandleUseCase: EventHandleUseCase,
    ) {}

    @EventPatternConfig<KafkaTopics>('service_on', Transport.KAFKA)
    public async service_on(@Payload() payload: EventPayload): Promise<void> {
        const useCaseParams: EventHandleUseCaseInput = {
            payload,
            instruction: Instruction.On,
        };

        return await this.eventHandleUseCase.execute(useCaseParams);
    }

    @EventPatternConfig<KafkaTopics>('service_off', Transport.KAFKA)
    public async service_off(@Payload() payload: EventPayload): Promise<void> {
        const useCaseParams: EventHandleUseCaseInput = {
            payload,
            instruction: Instruction.Off,
        };

        return await this.eventHandleUseCase.execute(useCaseParams);
    }
}