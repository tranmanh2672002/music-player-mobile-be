import { HttpStatus } from '@/common/constants';
import { ErrorResponse, SuccessResponse } from '@/common/helpers/response';
import {
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    Post,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/common/pipe/joi.validation.pipe';
import { MusicService } from '../music/services/music.youtube.service';
import { SongService } from '../song/services/song.service';
import { IAlbumAddSong, IAlbumCreate } from './album.interface';
import {
    albumAddSongSchema,
    albumCreateSchema,
    albumRemoveSongSchema,
} from './album.validator';
import { AlbumService } from './services/album.service';

@Controller('album')
export class AlbumController {
    constructor(
        private readonly albumService: AlbumService,
        private readonly songService: SongService,
        private readonly musicService: MusicService,
    ) {}

    @Get('/get-list/:id')
    async getList(@Param('id') deviceId: string) {
        try {
            const playlists = await this.albumService.getList(deviceId);
            return new SuccessResponse(playlists);
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    @Get('/get-detail/:id')
    async getDetail(@Param('id') id) {
        try {
            const album = await this.albumService.getDetail(id);
            return new SuccessResponse(album);
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    @Post('/create')
    async create(
        @Body(new JoiValidationPipe(albumCreateSchema))
        body: IAlbumCreate,
    ) {
        try {
            const album = await this.albumService.create(body);
            return new SuccessResponse(album);
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    @Post('/add-song/:id')
    async addSong(
        @Param('id') playlistId: string,
        @Body(new JoiValidationPipe(albumAddSongSchema))
        body: IAlbumAddSong,
    ) {
        try {
            const album = await this.albumService.get(playlistId);
            if (!album) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Album not exists',
                    [],
                );
            }
            // check song in database has youtubeId
            const song = await this.songService.getByYoutubeId(body?.youtubeId);
            if (!song) {
                const data = await this.musicService.getDetail(body.youtubeId);
                if (data) {
                    const newSong = await this.songService.create({
                        name: data?.title,
                        artist: data?.artist,
                        youtubeId: body?.youtubeId,
                        thumbnails: data?.thumbnails,
                        duration: data?.duration,
                    });
                    const result = await this.albumService.addSongIdToAlbum(
                        playlistId,
                        newSong._id,
                    );
                    return new SuccessResponse(result);
                } else {
                    return new ErrorResponse(
                        HttpStatus.NOT_FOUND,
                        'Music not exists',
                        [],
                    );
                }
            }
            const result = await this.albumService.addSongIdToAlbum(
                playlistId,
                song._id,
            );
            return new SuccessResponse(result);
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    @Post('/remove-song/:id')
    async removeSong(
        @Param('id') playlistId: string,
        @Body(new JoiValidationPipe(albumRemoveSongSchema))
        body: { id: string },
    ) {
        try {
            const album = await this.albumService.get(playlistId);
            if (!album) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Album not exists',
                    [],
                );
            }
            // check song in database has youtubeId
            const song = await this.songService.getById(body?.id);
            if (!song) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Song not exists',
                    [],
                );
            }
            const result = await this.albumService.removeSongIdToAlbum(
                playlistId,
                song._id,
            );
            return new SuccessResponse(result);
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    @Delete('/delete/:id')
    async delete(
        @Param('id')
        id: string,
    ) {
        try {
            const album = await this.albumService.get(id);
            if (!album) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Album not exists',
                    [],
                );
            }
            await this.albumService.delete(id);
            return new SuccessResponse({ id });
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }
}
