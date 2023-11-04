import { Prisma } from '@prisma/client';
import { IsString, MinLength } from 'class-validator';

export class CreateRoleDto implements Prisma.RoleCreateInput {
    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @MinLength(3)
    description: string;
}
