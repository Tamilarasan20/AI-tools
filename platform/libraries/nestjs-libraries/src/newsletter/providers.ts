import { BeehiivProvider } from '@loraloop/nestjs-libraries/newsletter/providers/beehiiv.provider';
import { EmailEmptyProvider } from '@loraloop/nestjs-libraries/newsletter/providers/email-empty.provider';
import { ListmonkProvider } from '@loraloop/nestjs-libraries/newsletter/providers/listmonk.provider';

export const newsletterProviders = [
  new BeehiivProvider(),
  new ListmonkProvider(),
  new EmailEmptyProvider(),
];
