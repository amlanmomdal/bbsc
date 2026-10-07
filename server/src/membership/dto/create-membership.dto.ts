import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMembershipDto {
  @ApiProperty({ example: 'Rahul Das', description: 'Full name of applicant' })
  fullName: string;

  @ApiPropertyOptional({ example: 'rahul.das@example.com', description: 'Email address' })
  email?: string;

  @ApiProperty({ example: '+91 9876543210', description: 'Contact phone number' })
  phone: string;

  @ApiPropertyOptional({ example: 'Burul, South 24 Parganas', description: 'Residential address or area' })
  address?: string;

  @ApiPropertyOptional({ example: 'General Volunteer', description: 'Area of interest or volunteering role' })
  interest?: string;

  @ApiPropertyOptional({ example: 25, description: 'Age' })
  age?: number;

  @ApiPropertyOptional({ example: 'Student', description: 'Occupation' })
  occupation?: string;
}
