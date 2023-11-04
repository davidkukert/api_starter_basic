import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    private passwordHash(password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync());
    }

    create({ username, password }: CreateUserDto) {
        const hashedPassword = this.passwordHash(password);

        return this.prismaService.user.create({
            data: {
                username,
                password: hashedPassword,
                roles: {
                    connectOrCreate: {
                        create: {
                            name: 'user',
                            description: 'User',
                        },
                        where: {
                            name: 'user',
                        },
                    },
                },
            },
            select: {
                id: true,
                username: true,
            },
        });
    }

    findAll() {
        return this.prismaService.user.findMany({
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                roles: {
                    select: {
                        name: true,
                        description: true,
                    },
                },
            },
        });
    }

    findOne(id: string) {
        return this.prismaService.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                roles: {
                    select: {
                        name: true,
                        description: true,
                    },
                },
            },
        });
    }

    update(id: string, data: UpdateUserDto) {
        if (
            data.password &&
            !/^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/.test(data.password)
        ) {
            data.password = this.passwordHash(data.password);
        }

        const { username, password } = data;

        return this.prismaService.user.update({
            where: { id },
            data: {
                username,
                password,
            },
        });
    }

    remove(id: string) {
        return this.prismaService.user.delete({ where: { id } });
    }

    findByUsername(username: string) {
        return this.prismaService.user.findUnique({
            where: { username },
            include: {
                roles: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });
    }

    findUnique(where: Prisma.UserWhereUniqueInput) {
        return this.prismaService.user.findUnique({
            where,
            include: {
                roles: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });
    }
}
