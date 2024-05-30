import {Otp, OtpSchema} from '@entities/index';
import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {OtpRepository} from '@repositories/otp.repository';
import {OtpService} from './otp.service';
import {LoggerModule} from '@modules/logger/logger.module';

@Module({
  imports: [MongooseModule.forFeature([{name: Otp.name, schema: OtpSchema}]), LoggerModule],
  providers: [
    OtpService,
    {
      useClass: OtpRepository,
      provide: 'OtpRepositoryInterface',
    },
  ],
  exports: [OtpService],
})
export class OtpModule {}
