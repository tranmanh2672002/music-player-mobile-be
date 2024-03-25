import { MusicService } from '../music/services/music.youtube.service';
import { PlaylistService } from './services/album.service';
import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { JwtService } from '@nestjs/jwt';
import { AlbumRepo } from '@/repositories/album.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from '@/mongo-schemas/album.schema';
import { SongRepo } from '@/repositories/song.repo';
import { Song, SongSchema } from '@/mongo-schemas/song.schema';
import { MusicClient } from 'youtubei';
import { SongService } from '../song/services/song.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Album.name, schema: AlbumSchema },
            { name: Song.name, schema: SongSchema },
        ]),
    ],
    controllers: [AlbumController],
    providers: [
        PlaylistService,
        JwtService,
        AlbumRepo,
        SongRepo,
        MusicService,
        MusicClient,
        SongService,
    ],
    exports: [PlaylistService],
})
export class AlbumModule {
    //
}
