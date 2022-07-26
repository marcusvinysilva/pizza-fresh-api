import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppStatus(baseUrl: string): string {
    return `Server is running! 🚀\n Please check ${baseUrl}/api for Swagger docs...`;
  }
}
