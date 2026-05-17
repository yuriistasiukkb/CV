import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailjet from 'node-mailjet';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private mailjet: Mailjet;

  constructor(private config: ConfigService) {
    this.mailjet = new Mailjet({
      apiKey: this.config.get<string>('MAILJET_API_KEY'),
      apiSecret: this.config.get<string>('MAILJET_API_SECRET'),
    });
  }

  async sendContactEmail(dto: CreateContactDto): Promise<void> {
    const fromEmail = this.config.get<string>('MAILJET_SENDER_EMAIL');
    const fromName = this.config.get<string>('MAILJET_SENDER_NAME') || 'CV Contact Form';
    const ownerEmail = this.config.get<string>('OWNER_EMAIL');

    try {
      await this.mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: fromName,
            },
            To: [
              {
                Email: ownerEmail,
                Name: 'Стасюк Юрій',
              },
            ],
            ReplyTo: {
              Email: dto.email,
              Name: dto.name,
            },
            Subject: `[CV Форма] ${dto.subject}`,
            TextPart: [
              `Нове повідомлення з форми зворотного зв'язку`,
              ``,
              `Ім'я: ${dto.name}`,
              `Email: ${dto.email}`,
              `Тема: ${dto.subject}`,
              ``,
              `Повідомлення:`,
              dto.message,
            ].join('\n'),
            HTMLPart: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #008eb0; border-bottom: 2px solid #84fab0; padding-bottom: 10px;">
                  Нове повідомлення з CV сайту
                </h2>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <tr>
                    <td style="padding: 8px; font-weight: bold; color: #005f73; width: 120px;">Ім'я:</td>
                    <td style="padding: 8px; color: #1a365d;">${dto.name}</td>
                  </tr>
                  <tr style="background: #f8f9fa;">
                    <td style="padding: 8px; font-weight: bold; color: #005f73;">Email:</td>
                    <td style="padding: 8px; color: #1a365d;"><a href="mailto:${dto.email}">${dto.email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; color: #005f73;">Тема:</td>
                    <td style="padding: 8px; color: #1a365d;">${dto.subject}</td>
                  </tr>
                </table>
                <div style="background: #f0f9ff; border-left: 4px solid #008eb0; padding: 15px; border-radius: 0 8px 8px 0; margin: 10px 0;">
                  <p style="font-weight: bold; color: #005f73; margin-bottom: 8px;">Повідомлення:</p>
                  <p style="color: #1a365d; white-space: pre-wrap;">${dto.message}</p>
                </div>
              </div>
            `,
          },
        ],
      });
    } catch (error) {
      console.error('Mailjet error:', error?.response?.data ?? error);
      throw new InternalServerErrorException('Не вдалося надіслати повідомлення');
    }
  }
}
