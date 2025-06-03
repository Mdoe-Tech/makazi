import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
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
    try {
      const result = await this.adminService.create(createAdminDto);
      return result;
    } catch (error) {
      this.loggingService.error('Failed to create admin:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error('Full error:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.SUPER_ADMIN)
  async findAll() {
    return this.adminService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OFFICE_ADMIN, Role.SUPER_ADMIN)
  getProfile(@Request() req) {
    console.log('GET /admin/profile hit');
    this.loggingService.log(`Getting admin profile. User object: ${JSON.stringify(req.user)}`);
    console.log('Profile endpoint user:', req.user);
    return this.adminService.findOne(req.user.userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OFFICE_ADMIN, Role.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  updateProfile(@Request() req, @Body() updateAdminDto: UpdateAdminDto) {
    console.log('PATCH /admin/profile hit');
    this.loggingService.log(`Updating admin profile. User object: ${JSON.stringify(req.user)}`);
    console.log('Update profile endpoint user:', req.user);
    return this.adminService.update(req.user.userId, updateAdminDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto
  ) {
    return this.adminService.update(id, updateAdminDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/toggle-active')
  @Roles(Role.SUPER_ADMIN)
  async toggleActive(@Param('id') id: string) {
    return this.adminService.toggleActive(id);
  }
} 