import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() dto: CreateContactDto) {
    await this.contactService.sendContactEmail(dto);
    return { success: true, message: 'Повідомлення надіслано успішно' };
  }
}
