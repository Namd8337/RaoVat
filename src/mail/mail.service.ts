import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  async sendOtp(email: string, otp: string) {
    await this.transporter.sendMail({
      from: `"Demo App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Mã OTP đặt lại mật khẩu',
      html: `
        <h2>Đặt lại mật khẩu</h2>
        <p>Mã OTP của bạn là:</p>

        <h1 style="letter-spacing: 5px;">
          ${otp}
        </h1>

        <p>Mã có hiệu lực trong <b>5 phút</b>.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
      `,
    });
  }
}
