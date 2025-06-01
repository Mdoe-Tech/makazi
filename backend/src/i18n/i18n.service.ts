import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class I18nService implements OnModuleInit {
  private readonly defaultLocale: string;
  private translations: Map<string, Record<string, any>>;

  constructor(private configService: ConfigService) {
    this.defaultLocale = this.configService.get<string>('DEFAULT_LOCALE', 'en');
    this.translations = new Map();
  }

  async onModuleInit() {
    await this.loadTranslations();
  }

  private async loadTranslations() {
    const locales = ['en', 'sw'];
    const translationsPath = path.join(__dirname, '..');

    for (const locale of locales) {
      try {
        const filePath = path.join(translationsPath, locale, `${locale}.json`);
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        const translations = JSON.parse(fileContent);
        this.translations.set(locale, translations);
      } catch (error) {
        console.error(`Failed to load translations for locale ${locale}:`, error);
      }
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  translate(key: string, locale: string = this.defaultLocale): string {
    const translations = this.translations.get(locale);
    if (!translations) return key;

    const value = this.getNestedValue(translations, key);
    return typeof value === 'string' ? value : key;
  }

  setTranslation(locale: string, translations: Record<string, any>): void {
    this.translations.set(locale, translations);
  }

  getAvailableLocales(): string[] {
    return Array.from(this.translations.keys());
  }

  getErrorMessage(error: { property: string; constraints: Record<string, string> }, locale: string = this.defaultLocale): string {
    const fieldName = this.getFieldName(error.property, locale);
    const messages = Object.values(error.constraints).map(constraint => {
      const message = this.translate(constraint, locale);
      return message.replace('{{field}}', fieldName);
    });
    return messages.join(', ');
  }

  getFieldName(field: string, locale: string = this.defaultLocale): string {
    const fieldName = this.translate(`fields.${field}`, locale);
    return fieldName !== `fields.${field}` ? fieldName : field;
  }

  getEnumValues(enumName: string, locale: string = this.defaultLocale): Record<string, string> {
    const enumValues = this.getNestedValue(this.translations.get(locale), `enums.${enumName}`);
    return typeof enumValues === 'object' ? enumValues : {};
  }
} 