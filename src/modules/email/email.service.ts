import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { StudioDto } from 'src/modules/studio/dtos/studio.dto';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendVerifyEmail(email: string, verifyToken: string) {
    const baseUrl = 'http://localhost:4000';
    const url = `${baseUrl}/auth/verify?verifyToken=${verifyToken}`;

    const mailOptions: EmailOptions = {
      to: email,
      subject: '[IndieHolic] 이메일 인증을 완료해주세요.',
      html: `
        아래 버튼을 클릭하여 이메일 인증을 완료해주세요.<br />
        <form action="${url}" method="POST">
          <button>가입확인</button>
        </form>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendStudioInvitationEmail(email: string, studio: StudioDto) {
    const mailOptions: EmailOptions = {
      to: email,
      subject: `[IndieHolic] ${studio.name} 스튜디오 초대장`,
      html: `
        ${studio.name} 스튜디오에 초대되었습니다.
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
