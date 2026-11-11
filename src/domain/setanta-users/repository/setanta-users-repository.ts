import { SetantaUser } from '@domain/setanta-users';

export interface SetantaUsersRepository {
    getByPaymeUserId(userId: string): Promise<SetantaUser | null>;
    create(setantaUser: SetantaUser): Promise<SetantaUser>;
}