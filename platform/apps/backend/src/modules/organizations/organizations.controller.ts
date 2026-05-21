import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreateOrgDto, UpdateOrgDto, InviteMemberDto, UpdateMemberRoleDto, OrgRole,
} from '@loraloop/shared';

@Controller()
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Post('organizations')
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateOrgDto) {
    return this.orgsService.create(userId, dto);
  }

  @Get('organizations')
  listMine(@CurrentUser('userId') userId: string) {
    return this.orgsService.listForUser(userId);
  }

  @Get('organizations/:orgId')
  @UseGuards(OrgMemberGuard)
  getOne(@Param('orgId') orgId: string, @CurrentUser('userId') userId: string) {
    return this.orgsService.getOne(orgId, userId);
  }

  @Patch('organizations/:orgId')
  @UseGuards(OrgMemberGuard)
  update(
    @Param('orgId') orgId: string,
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: OrgRole,
    @Body() dto: UpdateOrgDto,
  ) {
    return this.orgsService.update(orgId, userId, role, dto);
  }

  @Delete('organizations/:orgId')
  @UseGuards(OrgMemberGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('orgId') orgId: string, @CurrentUser('role') role: OrgRole) {
    return this.orgsService.delete(orgId, role);
  }

  @Get('organizations/:orgId/members')
  @UseGuards(OrgMemberGuard)
  listMembers(@Param('orgId') orgId: string) {
    return this.orgsService.listMembers(orgId);
  }

  @Post('organizations/:orgId/members/invite')
  @UseGuards(OrgMemberGuard)
  invite(
    @Param('orgId') orgId: string,
    @CurrentUser('role') role: OrgRole,
    @Body() dto: InviteMemberDto,
  ) {
    return this.orgsService.inviteMember(orgId, role, dto);
  }

  @Get('organizations/invite/:token')
  acceptInvite(@Param('token') token: string, @CurrentUser('userId') userId: string) {
    return this.orgsService.acceptInvite(token, userId);
  }

  @Delete('organizations/:orgId/members/:memberId')
  @UseGuards(OrgMemberGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMember(
    @Param('orgId') orgId: string,
    @Param('memberId') memberId: string,
    @CurrentUser('role') role: OrgRole,
  ) {
    return this.orgsService.removeMember(orgId, memberId, role);
  }

  @Patch('organizations/:orgId/members/:memberId/role')
  @UseGuards(OrgMemberGuard)
  updateMemberRole(
    @Param('orgId') orgId: string,
    @Param('memberId') memberId: string,
    @CurrentUser('role') role: OrgRole,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.orgsService.updateMemberRole(orgId, memberId, role, dto);
  }
}
