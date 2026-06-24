import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { ErrorResponse, JsonResponse } from '@on/handlers/responses';
import { ApiResponseDTO } from '@on/utils/dto/response.dto';
import { ResponseDTO } from '@on/utils/types';

import { AuthService } from './auth.service';
import { LoginDto, ResetPinDto, SharedAuthDto } from './dto/auth.dto';
import { OnboardingDto } from './dto/onboarding.dto';

import type { Response, Request } from 'express';

@ApiTags('Auth')
@ApiUnprocessableEntityResponse({ description: 'Error occurred', type: ApiResponseDTO })
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login User',
    description: 'Allow user to login',
  })
  @ApiOkResponse({ description: 'User successful login', type: ApiResponseDTO })
  @Post('login')
  async signIn(@Body() payload: LoginDto, @Res() res: Response, @Req() req: Request): Promise<ResponseDTO> {
    try {
      const response = await this.authService.signin(payload);

      return JsonResponse(res, response);
    } catch (error) {
      return ErrorResponse(res, error, req);
    }
  }

  @ApiOperation({
    summary: 'Onboard User',
    description: 'User onboards on On Buffer',
  })
  @ApiOkResponse({ description: 'User successfully submitted onboarding application', type: ApiResponseDTO })
  @Post('onboard')
  async onboard(@Body() payload: OnboardingDto, @Res() res: Response, @Req() req: Request): Promise<ResponseDTO> {
    try {
      const response = await this.authService.onboard(payload);

      return JsonResponse(res, response);
    } catch (error) {
      return ErrorResponse(res, error, req);
    }
  }

  @ApiOperation({
    summary: 'User Forget Pin',
    description: 'Allow user to reset their pin by sending an OTP to their phone number or email address',
  })
  @ApiOkResponse({ description: 'User pin otp sent successful', type: ApiResponseDTO })
  @Post('forget-pin')
  async forgetPin(@Body() payload: SharedAuthDto, @Res() res: Response, @Req() req: Request): Promise<ResponseDTO> {
    try {
      const response = await this.authService.forgetPin(payload);

      return JsonResponse(res, response);
    } catch (error) {
      return ErrorResponse(res, error, req);
    }
  }

  @ApiOperation({
    summary: 'User Reset their Pin',
    description: 'Allow user to reset their pin using the OTP received on their phone number or email address',
  })
  @ApiOkResponse({ description: 'Reset successful', type: ApiResponseDTO })
  @Post('reset-pin')
  async resetPin(@Body() payload: ResetPinDto, @Res() res: Response, @Req() req: Request): Promise<ResponseDTO> {
    try {
      const response = await this.authService.resetPin(payload);

      return JsonResponse(res, response);
    } catch (error) {
      return ErrorResponse(res, error, req);
    }
  }
}
