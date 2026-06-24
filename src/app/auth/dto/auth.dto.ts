import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import { ILogin, IResetPin, ISharedAuth } from '../types/auth.interface';

export class SharedAuthDto implements ISharedAuth {
  @ApiProperty({ description: 'User Phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class LoginDto extends SharedAuthDto implements ILogin {
  @ApiProperty({ description: 'User Pin' })
  @Length(4, 4)
  @Matches(/^\d{4}$/)
  @IsNotEmpty()
  pin: string;
}

export class ResetPinDto extends SharedAuthDto implements IResetPin {
  @ApiProperty({ description: 'New User Pin' })
  @IsString()
  @IsNotEmpty()
  pin: string;

  @ApiProperty({ description: 'User OTP code' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
