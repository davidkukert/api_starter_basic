import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
    PERMISSIONS_KEY,
    RequirePermissionsProps,
} from '../decorators/require-permissions.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

interface CustomRequest extends Request {
    user: {
        id: string;
        username: string;
    };
}

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prismaService: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions =
            this.reflector.getAllAndOverride<RequirePermissionsProps>(
                PERMISSIONS_KEY,
                [context.getHandler(), context.getClass()],
            );
        if (!requiredPermissions) {
            return true;
        }
        const request = context.switchToHttp().getRequest<CustomRequest>();
        const isUserRoute = request.url.includes('/users/');
        const params = request.params;

        const userLogged = await this.prismaService.user.findUnique({
            where: { id: request.user.id },
            select: {
                id: true,
                roles: {
                    select: {
                        name: true,
                        permissions: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (isUserRoute) {
            const userData = await this.prismaService.user.findUnique({
                where: { id: params.id },
                select: {
                    id: true,
                    roles: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            return !userData.roles.some((role) => {
                return (
                    role.name.includes('admin') && userLogged.id != userData.id
                );
            });
        }

        return userLogged.roles.some((role) => {
            return (
                role.name.includes('admin') ||
                requiredPermissions.roles?.includes(role.name) ||
                role.permissions.some((permission) => {
                    return requiredPermissions.permissions.includes(
                        permission.name,
                    );
                }) ||
                (isUserRoute && userLogged.id === params.id)
            );
        });
    }
}
