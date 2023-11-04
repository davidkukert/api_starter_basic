import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { RequirePermissions } from 'src/auth/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}
    @RequirePermissions({ permissions: ['role_create'] })
    @Post()
    async create(@Body() data: CreateRoleDto) {
        const role = await this.rolesService.findUnique({ name: data.name });

        if (role) {
            throw new BadRequestException('Role already exists');
        }

        return this.rolesService.create(data);
    }

    @RequirePermissions({ permissions: ['role_findall'] })
    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @RequirePermissions({ permissions: ['role_findone'] })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(id);
    }

    @RequirePermissions({ permissions: ['role_update'] })
    @Patch(':id')
    async update(@Param('id') id: string, @Body() data: UpdateRoleDto) {
        const role = await this.rolesService.findUnique({
            name: data.name,
            AND: { NOT: { id } },
        });

        if (role) {
            throw new BadRequestException('Role already exists');
        }

        return this.rolesService.update(id, data);
    }

    @RequirePermissions({ permissions: ['role_remove'] })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.rolesService.remove(id);
    }
}
