import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty({ message: "Ім'я є обов'язковим" })
  @IsString()
  @MinLength(2, { message: "Ім'я має містити щонайменше 2 символи" })
  @MaxLength(100, { message: "Ім'я не може перевищувати 100 символів" })
  name: string;

  @IsNotEmpty({ message: 'Email є обов\'язковим' })
  @IsEmail({}, { message: 'Введіть коректний email' })
  @MaxLength(254, { message: 'Email занадто довгий' })
  email: string;

  @IsNotEmpty({ message: 'Тема є обов\'язковою' })
  @IsString()
  @MinLength(2, { message: 'Тема має містити щонайменше 2 символи' })
  @MaxLength(200, { message: 'Тема не може перевищувати 200 символів' })
  subject: string;

  @IsNotEmpty({ message: 'Повідомлення є обов\'язковим' })
  @IsString()
  @MinLength(10, { message: 'Повідомлення має містити щонайменше 10 символів' })
  @MaxLength(2000, { message: 'Повідомлення не може перевищувати 2000 символів' })
  message: string;
}
