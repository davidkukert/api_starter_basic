import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { Prisma } from '@prisma/client';

export class UpdatePermissionDto
    extends PartialType(CreatePermissionDto)
    implements Prisma.PermissionUpdateInput {}
