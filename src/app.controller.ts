import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { AppService } from './app.service.js';
import { CalculateDto } from './calculate.dto.js';
import { ApiKeyGuard } from './api-key.guard.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('sum')
  getSum(
    @Query('a') a: string,
    @Query('b') b: string,
  ) {
    return this.appService.getSum(a, b);
  }

  @Post('calculate')
  @UseGuards(ApiKeyGuard)
  postCalculate(@Body() body: CalculateDto) {
    return {
      message: 'Dữ liệu chuẩn, đã xử lý!',
      data: body,
    };
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    const userId = parseInt(id, 10);

    const user = this.appService.getUserById(userId);

    if (!user) {
      return {
        status: 'error',
        message: `Không tìm thấy người dùng có ID là ${userId}`,
      };
    }

    return {
      status: 'success',
      data: user,
    };
  }
}