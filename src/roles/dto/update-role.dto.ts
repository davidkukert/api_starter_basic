import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { Prisma } from '@prisma/client';

export class UpdateRoleDto
    extends PartialType(CreateRoleDto)
    implements Prisma.RoleUpdateInput {}
