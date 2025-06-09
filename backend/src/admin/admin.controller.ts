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
      return {
        status: 'success',
        data: result
      };
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
  async create(@Body() createAdminDto: CreateAdminDto) {
    const admin = await this.adminService.create(createAdminDto);
    return {
      status: 'success',
      data: admin
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.SUPER_ADMIN)
  async findAll() {
    const admins = await this.adminService.findAll();
    return {
      status: 'success',
      data: admins
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const admin = await this.adminService.findOne(req.user.id);
    return {
      status: 'success',
      data: admin
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('profile')
  async updateProfile(@Request() req, @Body() updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminService.update(req.user.id, updateAdminDto);
    return {
      status: 'success',
      data: admin
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    const admin = await this.adminService.findOne(id);
    return {
      status: 'success',
      data: admin
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id')
  @Roles(Role.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminService.update(id, updateAdminDto);
    return {
      status: 'success',
      data: admin
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/toggle-active')
  @Roles(Role.SUPER_ADMIN)
  async toggleActive(@Param('id') id: string) {
    const admin = await this.adminService.toggleActive(id);
    return {
      status: 'success',
      data: admin
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    await this.adminService.remove(id);
    return {
      status: 'success',
      message: 'Admin user deleted successfully'
    };
  }
} 