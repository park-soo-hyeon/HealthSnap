import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: [
      // 개발 환경
      'http://localhost:3000', 
      'http://localhost:5173', 
      'http://localhost:8080',
      // 프로덕션: GitHub Pages
      'https://danto7632.github.io',
      'https://danto7632.github.io/HealthSnap', // GH Pages 프로젝트 경로
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Food Lite Health Checkup API')
    .setDescription('건강검진 데이터 관리 및 분석 API')
    .setVersion('1.0')
    .addTag('건강검진', '건강검진 데이터 CRUD 및 분석 기능')
    .setContact('Food Lite Team', '', 'contact@foodlite.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
    customSiteTitle: 'Food Lite Health Checkup API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { color: #2c3e50 }
    `,
  });

  // 글로벌 prefix 설정 (주석 처리)
  // app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Render 호환성을 위해 0.0.0.0 바인딩

  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
  console.log(`📚 Swagger documentation: http://0.0.0.0:${port}/api-docs`);
  console.log(`🏥 Health Checkup API: http://0.0.0.0:${port}/api/v1/health-checkups`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️ Database: ${process.env.DATABASE_URL ? 'PostgreSQL (Production)' : 'SQLite (Development)'}`);
}

bootstrap();
