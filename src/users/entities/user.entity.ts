import type { User as UserType } from '@prisma/client';

export class User implements UserType {
    id: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
