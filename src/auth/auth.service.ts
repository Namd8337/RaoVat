import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity.js';
import { MailService } from '../mail/mail.service.js';
import { PasswordResetToken } from './entities/password-reset-token.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,

  ) {}
   async testSendOtp(email: string) {
  const otp = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  await this.mailService.sendOtp(email, otp);

  return {
    message: 'Đã gửi OTP đến email',
    otp,
  };
}

async forgotPassword(email: string) {
  const user = await this.userRepository.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error('Email không tồn tại');
  }

  const otp = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  const expiresAt = new Date(
    Date.now() + 5 * 60 * 1000,
  );

  // Vô hiệu hóa OTP cũ
  await this.passwordResetTokenRepository.update(
    {
      email,
      used: false,
    },
    {
      used: true,
    },
  );

  // Lưu OTP mới
  await this.passwordResetTokenRepository.save({
    email,
    otp,
    expiresAt,
    used: false,
  });

  // Gửi OTP qua email
  await this.mailService.sendOtp(email, otp);

  return {
    message: 'Mã OTP đã được gửi đến email',
  };
}
async verifyOtp(email: string, otp: string) {
  const token = await this.passwordResetTokenRepository.findOne({
    where: {
      email,
      otp,
      used: false,
    },
    order: {
      createdAt: 'DESC',
    },
  });

  if (!token) {
    throw new UnauthorizedException('OTP không đúng');
  }

  if (new Date() > token.expiresAt) {
    throw new UnauthorizedException('OTP đã hết hạn');
  }

  return {
    message: 'OTP hợp lệ',
  };
}

async resetPassword(
  email: string,
  otp: string,
  newPassword: string,
) {
  const token = await this.passwordResetTokenRepository.findOne({
    where: {
      email,
      otp,
      used: false,
    },
    order: {
      createdAt: 'DESC',
    },
  });

  if (!token) {
    throw new UnauthorizedException('OTP không đúng');
  }

  if (new Date() > token.expiresAt) {
    throw new UnauthorizedException('OTP đã hết hạn');
  }

  const user = await this.userRepository.findOne({
    where: { email },
  });

  if (!user) {
    throw new UnauthorizedException('Tài khoản không tồn tại');
  }

  user.password = await bcrypt.hash(newPassword, 10);

  await this.userRepository.save(user);

  token.used = true;

  await this.passwordResetTokenRepository.save(token);

  return {
    message: 'Đặt lại mật khẩu thành công',
  };
}

  async register(data: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    phone?: string;
  }) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: data.username },
        { email: data.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username hoặc email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      phone: data.phone,
      role: 'user',
      status: 'active',

    });

    const savedUser = await this.userRepository.save(user);

    return {
      message: 'Đăng ký thành công',
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role,

      },
    };
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Sai username hoặc mật khẩu');
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Sai username hoặc mật khẩu');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Đăng nhập thành công',
      access_token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
  async changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string,
) {
  const user = await this.userRepository.findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new UnauthorizedException('Tài khoản không tồn tại');
  }

  const passwordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!passwordValid) {
    throw new UnauthorizedException(
      'Mật khẩu hiện tại không đúng',
    );
  }

  user.password = await bcrypt.hash(newPassword, 10);

  await this.userRepository.save(user);

  return {
    message: 'Đổi mật khẩu thành công',
  };
}
}