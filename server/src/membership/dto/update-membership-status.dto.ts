import { ApiProperty } from '@nestjs/swagger';

export class UpdateMembershipStatusDto {
  @ApiProperty({ example: 'approved', enum: ['pending', 'approved', 'rejected'] })
  status: string;
}
