import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PermissionsService {
    constructor(private prismaService: PrismaService) {}

    create({ description, name }: CreatePermissionDto) {
        return this.prismaService.permission.create({
            data: {
                description,
                name,
                roles: {
                    connectOrCreate: {
                        create: {
                            name: 'admin',
                            description: 'Administrator',
                        },
                        where: {
                            name: 'admin',
                        },
                    },
                },
            },
        });
    }

    findAll() {
        return this.prismaService.permission.findMany();
    }

    findOne(id: string) {
        return this.prismaService.permission.findUnique({
            where: { id },
        });
    }

    update(id: string, { description, name }: UpdatePermissionDto) {
        return this.prismaService.permission.update({
            where: { id },
            data: { description, name },
        });
    }

    remove(id: string) {
        return this.prismaService.permission.delete({
            where: { id },
        });
    }

    findUnique(where: Prisma.PermissionWhereUniqueInput) {
        return this.prismaService.permission.findUnique({ where });
    }
}
