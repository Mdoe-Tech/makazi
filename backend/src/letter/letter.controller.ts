import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { LetterService } from './letter.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('letters')
@Controller('letter')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LetterController {
  constructor(private readonly letterService: LetterService) {}
} 