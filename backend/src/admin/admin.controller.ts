import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Request, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { LoggingService } from '../logging/logging.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('admin/users')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly loggingService: LoggingService
  ) {}

  @Public()
  @Post('first-admin')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createFirstAdmin(@Body() createAdminDto: CreateAdminDto) {
    this.loggingService.log(`Attempting to create first admin user with username: ${createAdminDto.username} and email: ${createAdminDto.email}`);
    try {
      const result = await this.adminService.createFirstAdmin(createAdminDto);
      this.loggingService.log(`Successfully created first admin user with ID: ${result.id}`);
      return result;
    } catch (error) {
      this.loggingService.error(
        `Failed to create first admin user: ${error.message}`,
        JSON.stringify(error, Object.getOwnPropertyNames(error))
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createAdminDto: CreateAdminDto) {
    try {
      this.loggingService.log(
        `Attempting to create new admin user`,
        'AdminController',
        {
          username: createAdminDto.username,
          email: createAdminDto.email,
          role: createAdminDto.role,
          permissions: createAdminDto.permissions,
          is_active: createAdminDto.is_active
        }
      );

      const admin = await this.adminService.create(createAdminDto);
      
      this.loggingService.log(
        `Successfully created admin user`,
        'AdminController',
        {
          userId: admin.id,
          username: admin.username,
          role: admin.role
        }
      );

      return admin;
    } catch (error) {
      this.loggingService.error(
        `Failed to create admin user`,
        error.stack,
        'AdminController',
        {
          error: error.message,
          requestData: createAdminDto,
          validationErrors: error.response?.message
        }
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: 'Failed to create admin user',
        error: error.message,
        details: error.stack
      });
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