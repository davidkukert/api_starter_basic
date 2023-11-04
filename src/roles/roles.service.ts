import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
    constructor(private prismaService: PrismaService) {}

    create({ description, name }: CreateRoleDto) {
        return this.prismaService.role.create({
            data: {
                description,
                name,
            },
        });
    }

    findAll() {
        return this.prismaService.role.findMany();
    }

    findOne(id: string) {
        return this.prismaService.role.findUnique({ where: { id } });
    }

    update(id: string, { description, name }: UpdateRoleDto) {
        return this.prismaService.role.update({
            where: { id },
            data: {
                description,
                name,
            },
        });
    }

    remove(id: string) {
        return this.prismaService.role.delete({ where: { id } });
    }

    findUnique(where: Prisma.RoleWhereUniqueInput) {
        return this.prismaService.role.findUnique({ where });
    }
}
