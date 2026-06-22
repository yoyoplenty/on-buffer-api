import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { RoleModule } from './app/role/role.module';
import { SharedModule } from './app/shared/shared.module';
import { UserModule } from './app/user/user.module';
import { AppController } from './app.controller';
import { config } from './config';
import { HttpExceptionFilter } from './handlers/exceptions/http-exception.filter';

@Module({
  imports: [
    MongooseModule.forRoot(config.db.url as string),
    RoleModule,
    UserModule,
    SharedModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    {
      useClass: HttpExceptionFilter,
      provide: APP_FILTER,
    },
  ],
})
export class AppModule {}
