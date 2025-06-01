import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Role } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { LoggingService } from '../logging/logging.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly loggingService: LoggingService
  ) {}

  @Public()
  @Post('first-admin')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createFirstAdmin(@Body() createAdminDto: CreateAdminDto) {
    this.loggingService.log('Creating first admin user');
    return this.adminService.createFirstAdmin(createAdminDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createAdminDto: CreateAdminDto) {
    this.loggingService.log('Creating new admin user');
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN)
  async findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto
  ) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

  @Patch(':id/toggle-active')
  @Roles(Role.SUPER_ADMIN)
  async toggleActive(@Param('id') id: string) {
    return this.adminService.toggleActive(id);
  }

  @Get('profile')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getProfile(@Request() req) {
    return this.adminService.findOne(req.user.admin_id);
  }

  @Patch('profile')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProfile(
    @Request() req,
    @Body() updateAdminDto: UpdateAdminDto
  ) {
    return this.adminService.update(req.user.admin_id, updateAdminDto);
  }
} 