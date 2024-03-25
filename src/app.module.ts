import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { I18nModule } from './common/services/i18n.service';
import { WinstonModule } from './common/services/winston.service';
import envSchema from './common/config/validation-schema';
import { AppController } from './app.controller';
import { HeaderMiddleware } from './common/middleware/header.middleware';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/transform.interceptor';
import { HttpExceptionFilter } from './common/exceptions.filter';
import { MongoModule } from './common/services/mongo.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './modules/common/common.module';
import { MusicModule } from './modules/music/music.module';
import { AlbumModule } from './modules/album/album.module';
import { SongModule } from './modules/song/song.module';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            validationSchema: envSchema,
        }),
        CacheModule.register({
            isGlobal: true,
            ttl: 10000, // 10 seconds
        }),
        WinstonModule,
        I18nModule,
        MongoModule,
        CommonModule,
        AuthModule,
        UserModule,
        MusicModule,
        AlbumModule,
        SongModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            scope: Scope.REQUEST,
            useClass: HttpExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
    exports: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HeaderMiddleware).forRoutes('*');
    }
}
