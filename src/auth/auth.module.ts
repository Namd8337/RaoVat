import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt.guard.js';
import { MailModule } from '../mail/mail.module.js';


import { User } from '../users/user.entity.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PasswordResetToken } from './entities/password-reset-token.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordResetToken]),
    JwtModule.register({
      secret: 'NEST_SECRET_JWT_2026',
      signOptions: {
        expiresIn: '7d',
      },
    }),
    MailModule,
    
  ],
   
  controllers: [AuthController],
  providers: [AuthService,JwtAuthGuard],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}