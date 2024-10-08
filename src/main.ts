import { HttpException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // cors config
  app.enableCors({
    credentials: true,
    origin: process.env.CORS_ORIGIN || '*',
  }); 
  // prisma config
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // swagger config
  const config = new DocumentBuilder()
    .setTitle('Url shortener')
    .setDescription('Documentação da API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  // exception catch
  app.use((error: any, request: Request, response: Response, nest: NextFunction)=>{
    console.log(error)
    if(error instanceof HttpException){
      response.send(error.getStatus).send(error.message)
    } else {
      response.send(500).send('Internal server error')
    }
  })

  // pipe of validation cnfig
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
