import { Song, SongSchema } from '@/mongo-schemas/song.schema';
import { SongRepo } from '@/repositories/song.repo';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { RecentlyService } from './services/recently.service';
import { RecentlyController } from './recently.controller';
import { RecentlyRepo } from '@/repositories/recently.repo';
import { Recently, RecentlySchema } from '@/mongo-schemas/recently.schema';
import { SongService } from '../song/services/song.service';
import { MusicService } from '../music/services/music.youtube.service';
import { MusicClient } from 'youtubei';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Song.name, schema: SongSchema },
            { name: Recently.name, schema: RecentlySchema },
        ]),
    ],
    controllers: [RecentlyController],
    providers: [
        RecentlyService,
        JwtService,
        SongRepo,
        SongService,
        RecentlyRepo,
        MusicService,
        MusicClient,
    ],
    exports: [RecentlyService],
})
export class RecentlyModule {
    //
}
