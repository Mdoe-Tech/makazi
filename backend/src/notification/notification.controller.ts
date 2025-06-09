import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { LoggingService } from '../logging/logging.service';

@Controller('notification')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly loggingService: LoggingService
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    this.loggingService.log('Creating new notification');
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Get('recipient/:type/:id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findByRecipient(
    @Param('type') type: string,
    @Param('id') id: string
  ) {
    return this.notificationService.findByRecipient(id, type);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto
  ) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Patch(':id/read')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Patch(':id/archive')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async markAsArchived(@Param('id') id: string) {
    return this.notificationService.markAsArchived(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }

  @Get('my-notifications')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async getMyNotifications(@Request() req) {
    return this.notificationService.findByRecipient(req.user.admin_id, 'admin');
  }
} 