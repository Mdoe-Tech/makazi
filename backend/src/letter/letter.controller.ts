import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LetterService } from './letter.service';
import { CreateLetterDto, ApproveLetterDto, RejectLetterDto } from './dto/create-letter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('letters')
@Controller('letters')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @Post('citizen/:id')
  @Roles(Role.REGISTRAR)
  @ApiOperation({ summary: 'Create a new letter for a citizen' })
  @ApiResponse({ status: 201, description: 'Letter created successfully' })
  async create(
    @Param('id') citizenId: string,
    @Body() createLetterDto: CreateLetterDto
  ) {
    return this.letterService.create(citizenId, createLetterDto);
  }

  @Get()
  @Roles(Role.OFFICE_ADMIN, Role.APPROVER)
  @ApiOperation({ summary: 'Get all letters' })
  @ApiResponse({ status: 200, description: 'Return all letters' })
  async findAll() {
    return this.letterService.findAll();
  }

  @Get(':id')
  @Roles(Role.OFFICE_ADMIN, Role.APPROVER, Role.REGISTRAR)
  @ApiOperation({ summary: 'Get a letter by ID' })
  @ApiResponse({ status: 200, description: 'Return the letter' })
  async findOne(@Param('id') id: string) {
    return this.letterService.findOne(id);
  }

  @Get('citizen/:id')
  @Roles(Role.OFFICE_ADMIN, Role.APPROVER, Role.REGISTRAR)
  @ApiOperation({ summary: 'Get all letters for a citizen' })
  @ApiResponse({ status: 200, description: 'Return all letters for the citizen' })
  async findByCitizenId(@Param('id') citizenId: string) {
    return this.letterService.findByCitizenId(citizenId);
  }

  @Post(':id/approve')
  @Roles(Role.APPROVER)
  @ApiOperation({ summary: 'Approve a letter' })
  @ApiResponse({ status: 200, description: 'Letter approved successfully' })
  async approve(
    @Param('id') id: string,
    @Body() approveLetterDto: ApproveLetterDto,
    @Request() req
  ) {
    return this.letterService.approve(id, approveLetterDto, req.user.id);
  }

  @Post(':id/reject')
  @Roles(Role.APPROVER)
  @ApiOperation({ summary: 'Reject a letter' })
  @ApiResponse({ status: 200, description: 'Letter rejected successfully' })
  async reject(
    @Param('id') id: string,
    @Body() rejectLetterDto: RejectLetterDto,
    @Request() req
  ) {
    return this.letterService.reject(id, rejectLetterDto, req.user.id);
  }

  @Get(':id/content')
  @Roles(Role.OFFICE_ADMIN, Role.APPROVER, Role.REGISTRAR)
  @ApiOperation({ summary: 'Get letter content' })
  @ApiResponse({ status: 200, description: 'Return the letter content' })
  async getLetterContent(@Param('id') id: string) {
    const letter = await this.letterService.findOne(id);
    return this.letterService.generateLetterContent(letter);
  }
} 