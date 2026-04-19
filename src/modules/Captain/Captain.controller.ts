import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CaptainService } from './Captain.service';
import { CreateCaptainDto } from './dtos/Captain-Create.dto';
import { UpdateCaptainDto } from './dtos/Captain-update.dto';
import { CaptainQueryDto } from './dtos/CaptainQuery.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Captains')
@Controller('captains')
export class CaptainController {
  constructor(private readonly captainsService: CaptainService) {}

  @Post()
  @ApiOperation({ summary: 'Create new captain' })
  create(@Body() createCaptainDto: CreateCaptainDto) {
    return this.captainsService.create(createCaptainDto);
  }

  @Get()
  findAll(@Query() query: CaptainQueryDto) {
    return this.captainsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.captainsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaptainDto: UpdateCaptainDto) {
    return this.captainsService.update(id, updateCaptainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.captainsService.remove(id);
  }

  @Patch(':id/status')
  toggleStatus(
    @Param('id') id: string,
    @Body('status') status: 'active' | 'inactive',
  ) {
    return this.captainsService.toggleStatus(id, status);
  }
}