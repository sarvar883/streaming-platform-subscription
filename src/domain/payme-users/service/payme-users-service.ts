import { PaymeUser, PaymeUsersRepository, UserNotFoundError, UserPhoneNotFoundError } from '@domain/payme-users';


export interface PaymeUsersService {
    getById(paymeUserId: string): Promise<PaymeUser>;
    getPhoneFromUserId(userId: string): Promise<string>;
}


export class PaymeUsersServiceImpl implements PaymeUsersService {
    constructor(
        private readonly paymeUsersRepository: PaymeUsersRepository,
    ) {}

    async getById(paymeUserId: string): Promise<PaymeUser> {
        const paymeUser: PaymeUser | null = await this.paymeUsersRepository.getUserById(paymeUserId);

        if (!paymeUser) {
            throw new UserNotFoundError();
        }

        return paymeUser;
    }

    async getPhoneFromUserId(paymeUserId: string): Promise<string> {
        const paymeUser: PaymeUser = await this.getById(paymeUserId);

        if (!paymeUser.phone) {
            throw new UserPhoneNotFoundError();
        }

        return `+${paymeUser.phone}`;
    }
}