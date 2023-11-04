import { Prisma } from '@prisma/client';
import { IsString, MinLength } from 'class-validator';

export class CreateUserDto implements Prisma.UserCreateInput {
    @IsString()
    @MinLength(3)
    username: string;

    @IsString()
    @MinLength(6)
    //@IsStrongPassword()
    password: string;
}
