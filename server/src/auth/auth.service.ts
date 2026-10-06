import * as crypto from 'crypto';
import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthOtp, AuthOtpDocument } from '../schemas/auth-otp.schema';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly STATIC_ADMIN_EMAIL = 'amlanmondal98@gmail.com';
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'bbsc_admin_secret_key_2026_secure';

  constructor(
    @InjectModel(AuthOtp.name) private authOtpModel: Model<AuthOtpDocument>
  ) {}

  generateJwt(payload: any, expiresInSeconds = 86400): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const expPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + expiresInSeconds };

    const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
    const base64Payload = Buffer.from(JSON.stringify(expPayload)).toString('base64url');

    const signature = crypto
      .createHmac('sha256', this.JWT_SECRET)
      .update(`${base64Header}.${base64Payload}`)
      .digest('base64url');

    return `${base64Header}.${base64Payload}.${signature}`;
  }

  verifyJwt(token: string): any {
    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Permission denied. Authorization token required.');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('Permission denied. Invalid token format.');
    }

    const [base64Header, base64Payload, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', this.JWT_SECRET)
      .update(`${base64Header}.${base64Payload}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      throw new UnauthorizedException('Permission denied. Invalid token signature.');
    }

    try {
      const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf8'));
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new UnauthorizedException('Permission denied. Token has expired. Please log in again.');
      }
      return payload;
    } catch (e: any) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('Permission denied. Invalid token payload.');
    }
  }

  async sendOtp(dto: SendOtpDto) {
    const inputEmail = dto.email?.trim().toLowerCase();

    if (!inputEmail) {
      throw new BadRequestException('Email address is required.');
    }

    if (inputEmail !== this.STATIC_ADMIN_EMAIL.toLowerCase()) {
      throw new UnauthorizedException(`Access denied. Only static admin email (${this.STATIC_ADMIN_EMAIL}) is authorized.`);
    }

    // Generate 4-digit OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 Minutes Expiry

    // Persist OTP in MongoDB Atlas [bbsc] database
    await this.authOtpModel.deleteMany({ email: inputEmail });
    await this.authOtpModel.create({
      email: inputEmail,
      otp: generatedOtp,
      expiresAt,
    });

    // Server Console Logger
    this.logger.log('====================================================');
    this.logger.log(`🔑 ADMIN OTP GENERATED & STORED IN MONGODB ATLAS [bbsc]`);
    this.logger.log(`👉 ADMIN EMAIL: [ ${this.STATIC_ADMIN_EMAIL} ]`);
    this.logger.log(`👉 4-DIGIT VERIFICATION OTP CODE: [ ${generatedOtp} ]`);
    this.logger.log(`⏰ Valid for 5 minutes (Expires: ${expiresAt.toLocaleTimeString()})`);
    this.logger.log('====================================================');

    // Optional Nodemailer SMTP Email Sender
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT) || 587,
          secure: false,
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: `"BBSC Admin Portal" <${smtpUser}>`,
          to: this.STATIC_ADMIN_EMAIL,
          subject: `🔐 BBSC Admin OTP: ${generatedOtp}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f9; border-radius: 10px;">
              <h2 style="color: #1e3a8a;">Burul Blue Star Club (BBSC) Admin Login</h2>
              <p>Hello Admin,</p>
              <p>Your 4-digit OTP for logging into the BBSC Admin Portal is:</p>
              <div style="font-size: 32px; font-weight: bold; color: #d97706; letter-spacing: 6px; margin: 20px 0;">
                ${generatedOtp}
              </div>
              <p>This code is valid for 5 minutes. Do not share this OTP with anyone.</p>
              <hr style="border: none; border-top: 1px solid #ddd;" />
              <p style="font-size: 12px; color: #888;">BBSC Security Team • Burul, South 24 Parganas</p>
            </div>
          `,
        });
        this.logger.log(`✉️ Email successfully dispatched to ${this.STATIC_ADMIN_EMAIL}`);
      } catch (err: any) {
        this.logger.error(`Failed to dispatch SMTP email: ${err?.message || err}`);
      }
    }

    return {
      success: true,
      message: `4-digit OTP has been dispatched to ${this.STATIC_ADMIN_EMAIL}.`,
      devOtp: generatedOtp,
      expiresInSeconds: 300,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const inputEmail = dto.email?.trim().toLowerCase();
    const inputOtp = dto.otp?.trim();

    if (!inputEmail || !inputOtp) {
      throw new BadRequestException('Both email and 4-digit OTP code are required.');
    }

    if (inputEmail !== this.STATIC_ADMIN_EMAIL.toLowerCase()) {
      throw new UnauthorizedException('Invalid email address.');
    }

    // Query OTP record from MongoDB Atlas
    const record = await this.authOtpModel.findOne({ email: inputEmail }).sort({ createdAt: -1 });

    if (!record) {
      throw new BadRequestException('No active OTP request found. Please click "Send OTP".');
    }

    if (new Date() > new Date(record.expiresAt)) {
      await this.authOtpModel.deleteMany({ email: inputEmail });
      throw new BadRequestException('OTP code has expired. Please request a new 4-digit OTP.');
    }

    if (record.otp !== inputOtp) {
      throw new UnauthorizedException('Incorrect 4-digit OTP code. Please check and try again.');
    }

    // OTP Verified successfully -> Clear record
    await this.authOtpModel.deleteMany({ email: inputEmail });

    const user = {
      email: this.STATIC_ADMIN_EMAIL,
      name: 'Amlan Mondal (Admin)',
      role: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    };

    const accessToken = this.generateJwt({
      email: this.STATIC_ADMIN_EMAIL,
      role: 'Super Admin',
      name: 'Amlan Mondal (Admin)'
    });

    return {
      success: true,
      message: 'OTP verification successful! Welcome back, Admin.',
      accessToken,
      user,
    };
  }

  getProfile(email: string) {
    if (email?.toLowerCase() !== this.STATIC_ADMIN_EMAIL.toLowerCase()) {
      throw new UnauthorizedException('Unauthorized access.');
    }
    return {
      email: this.STATIC_ADMIN_EMAIL,
      name: 'BBSC (Admin)',
      role: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    };
  }
}
