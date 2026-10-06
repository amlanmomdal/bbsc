import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthOtp, AuthOtpSchema } from '../schemas/auth-otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuthOtp.name, schema: AuthOtpSchema }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
