import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipStatusDto } from './dto/update-membership-status.dto';
import { Public } from '../auth/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Membership Applications')
@UseGuards(JwtAuthGuard)
@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Public()
  @ApiOperation({ summary: 'Submit new Become a Member / Volunteer application (Public endpoint)' })
  @Post()
  async create(@Body() dto: CreateMembershipDto) {
    const data = await this.membershipService.create(dto);
    return {
      success: true,
      message: 'Congratulations! Your membership application has been submitted successfully.',
      data,
    };
  }

  @Public()
  @ApiOperation({ summary: 'List all membership applications (Public / Admin)' })
  @Get()
  async findAll(@Query('status') status?: string) {
    const data = await this.membershipService.findAll(status);
    return { success: true, count: data.length, data };
  }

  @Public()
  @ApiOperation({ summary: 'Get membership application details by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.membershipService.findOne(id);
    return { success: true, data };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update membership application status (Admin protected)' })
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateMembershipStatusDto) {
    const data = await this.membershipService.updateStatus(id, dto);
    return {
      success: true,
      message: `Membership application marked as ${dto.status}.`,
      data,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update membership application (Admin protected - supports PUT :id directly)' })
  @Put(':id')
  async updateStatusDirect(@Param('id') id: string, @Body() dto: UpdateMembershipStatusDto) {
    const data = await this.membershipService.updateStatus(id, dto);
    return {
      success: true,
      message: `Membership application status updated to ${dto.status}.`,
      data,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete membership application (Admin protected)' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.membershipService.remove(id);
  }
}
