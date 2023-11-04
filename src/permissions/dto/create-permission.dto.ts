import { Prisma } from '@prisma/client';
import { IsString, MinLength } from 'class-validator';

export class CreatePermissionDto implements Prisma.PermissionCreateInput {
    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @MinLength(3)
    description: string;
}
