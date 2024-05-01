export class MailDto {
  to: string;
  subject: string;
  context: {[name: string]: any};
  template: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
  inReplyTo?: string;
}
