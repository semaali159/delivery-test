import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportsService } from './Report.service';
import { OrderVolumeDropQueryDto } from './dtos/Order-volume-drop-query.dto';

@ApiTags('Reports')
@Controller('reports/captains')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('order-volume-drop')
  orderVolumeDrop(@Query() query: OrderVolumeDropQueryDto) {
    return this.reportsService.getCaptainOrderVolumeDrop(query);
  }
}