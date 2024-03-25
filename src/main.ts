import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppModule } from './app.module';
import ConfigKey from './common/config/config-key';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(helmet());
    app.use(cookieParser());
    const configService = app.get(ConfigService);
    const whiteList = configService.get(ConfigKey.CORS_WHITELIST) || '*';
    const corsOptions: CorsOptions = {
        origin:
            whiteList?.split(',')?.length > 1
                ? whiteList.split(',')
                : whiteList,
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Language',
            'X-Timezone',
            'X-Timezone-Name',
        ],
        optionsSuccessStatus: 200,
        methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    };
    app.enableCors(corsOptions);
    // setup prefix of route
    app.setGlobalPrefix(configService.get(ConfigKey.BASE_PATH));
    // use winston for logger
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    await app.listen(configService.get(ConfigKey.PORT));
}
bootstrap();
