import { SetMetadata } from '@nestjs/common';

export interface RequirePermissionsProps {
    permissions: string[];
    roles?: string[];
}

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (props: RequirePermissionsProps) =>
    SetMetadata(PERMISSIONS_KEY, props);
