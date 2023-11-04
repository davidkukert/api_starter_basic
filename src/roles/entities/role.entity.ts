import { Role as RoleType } from '@prisma/client';

export class Role implements RoleType {
    id: string;
    name: string;
    description: string;
}
