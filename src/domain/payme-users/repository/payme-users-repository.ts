import { PaymeUser } from '@domain/payme-users';

export interface PaymeUsersRepository {
    getUserById(id: string): Promise<PaymeUser | null>;
}