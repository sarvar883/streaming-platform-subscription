import {
    SetantaUsersRepository,
    SetantaUser,
} from '@domain/setanta-users';


export interface SetantaUsersService {
    getOrCreateUser(paymeUserId: string): Promise<SetantaUser>;
    getByPaymeUserId(paymeUserId: string): Promise<SetantaUser | null>;
}


export class SetantaUsersServiceImpl implements SetantaUsersService {
    constructor(
        private readonly setantaUsersRepository: SetantaUsersRepository,
    ) {}

    public async getOrCreateUser(paymeUserId: string): Promise<SetantaUser> {
        const user: SetantaUser | null = await this.getByPaymeUserId(paymeUserId);

        if (!user) return await this.create(paymeUserId);

        return user;
    }

    public async getByPaymeUserId(paymeUserId: string): Promise<SetantaUser | null> {
        const user: SetantaUser = await this.setantaUsersRepository.getByPaymeUserId(paymeUserId);

        if (!user) return null;

        return user;
    }

    private async create(paymeUserId: string): Promise<SetantaUser> {
        let setantaUser: SetantaUser = new SetantaUser({
            externalUserId: paymeUserId,
            source: 'payme',
        });

        setantaUser = await this.setantaUsersRepository.create(setantaUser);

        return setantaUser;
    }
}