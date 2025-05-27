import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  const PORT = config.PORT;
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => console.log('Server running on port', PORT));
}
bootstrap();
