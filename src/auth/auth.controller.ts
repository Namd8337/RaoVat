import { Body, Controller, Post,Req,UseGuards  } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    try {
      console.log('EMAIL NHAN DUOC:', email);

      const result = await this.authService.forgotPassword(email);

      console.log('FORGOT PASSWORD OK:', result);

      return result;
    } catch (error) {
      console.error('FORGOT PASSWORD ERROR:', error);

      return {
        statusCode: 500,
        message: error instanceof Error ? error.message : error,
      };
    }
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ) {
    return await this.authService.verifyOtp(email, otp);
  }

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(
      body.username,
      body.password,
    );
  }

  @Post('test-email')
  async testEmail(@Body('email') email: string) {
    return await this.authService.testSendOtp(email);
  }
  @Post('reset-password')
async resetPassword(
  @Body('email') email: string,
  @Body('otp') otp: string,
  @Body('newPassword') newPassword: string,
) {
  return await this.authService.resetPassword(
    email,
    otp,
    newPassword,
  );
}
    @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req: any,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return await this.authService.changePassword(
      req.user.sub,
      currentPassword,
      newPassword,
    );
  }
}

