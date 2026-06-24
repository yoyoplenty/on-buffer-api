import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEmail, IsEnum, IsNumber, ValidateNested, IsNotEmpty } from 'class-validator';

import { SalaryRange } from '@on/app/user/types/employment.interface';
import { RepaymentMethod } from '@on/app/user/types/repayment.interface';
import { IdType } from '@on/app/user/types/verification.interface';
import { IsPhoneNumberE164 } from '@on/helpers/validator';

export class PersonalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '2347049965569' })
  @IsPhoneNumberE164({ message: 'Invalid phone number' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  area: string;
}

export class EmploymentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employer: string;

  @ApiProperty({ enum: SalaryRange })
  @IsEnum(SalaryRange)
  @IsNotEmpty()
  salaryRange: SalaryRange;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  salaryPaymentDay: number;
}

export class VerificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bvn: string;

  @ApiProperty({ enum: IdType })
  @IsEnum(IdType)
  @IsNotEmpty()
  type: IdType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  documentUrl?: string;
}

export class RepaymentDto {
  @ApiProperty({ enum: RepaymentMethod })
  @IsEnum(RepaymentMethod)
  @IsNotEmpty()
  repaymentMethod: RepaymentMethod;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankCode: string;
}

export class CardDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  cardNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  expiryMonth: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  expiryYear: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cvv: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cardholderName: string;
}

export class OnboardingDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => PersonalDto)
  personalDto: PersonalDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => EmploymentDto)
  employmentDto: EmploymentDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => VerificationDto)
  verificationDto: VerificationDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => RepaymentDto)
  repaymentDto: RepaymentDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => CardDto)
  cardDto: CardDto;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pin: string;
}
