import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';
import {MailDto} from './dto/mail.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(data: MailDto) {
    const {to, subject, cc, bcc, replyTo, inReplyTo, template, context} = data;

    await this.mailerService.sendMail({
      to: to,
      cc: cc,
      bcc: bcc,
      replyTo: replyTo,
      inReplyTo: inReplyTo,
      subject: subject,
      template: `./${template}`,
      context: context,
    });
  }
}
