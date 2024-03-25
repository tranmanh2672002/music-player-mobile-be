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
    Req,
    UseGuards,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/common/pipe/joi.validation.pipe';
import { MusicService } from '../music/services/music.youtube.service';
import { SongService } from '../song/services/song.service';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { IAlbumAddSong, IAlbumCreate } from './album.interface';
import {
    albumAddSongSchema,
    albumCreateSchema,
    albumRemoveSongSchema,
} from './album.validator';
import { PlaylistService } from './services/album.service';

@UseGuards(AuthenticationGuard)
@Controller('album')
export class AlbumController {
    constructor(
        private readonly playlistService: PlaylistService,
        private readonly songService: SongService,
        private readonly musicService: MusicService,
    ) {}

    @Get('/get-list')
    async getList(@Req() req) {
        try {
            const playlists = await this.playlistService.getList(
                req?.loginUser?._id,
            );
            return new SuccessResponse(playlists);
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    @Get('/get/:id/detail')
    async getDetail(@Param('id') id) {
        try {
            const album = await this.playlistService.getDetail(id);
            return new SuccessResponse(album);
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    @Post('/create')
    async create(
        @Req() req,
        @Body(new JoiValidationPipe(albumCreateSchema))
        body: IAlbumCreate,
    ) {
        try {
            const album = await this.playlistService.create(
                req?.loginUser?._id,
                body.name,
            );
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
            const album = await this.playlistService.get(playlistId);
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
                        artist: data?.artist?.name,
                        youtubeId: body?.youtubeId,
                        thumbnails: data?.thumbnails,
                    });
                    const result =
                        await this.playlistService.addSongIdToPlaylist(
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
            const result = await this.playlistService.addSongIdToPlaylist(
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
            const album = await this.playlistService.get(playlistId);
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
            const result = await this.playlistService.removeSongIdToPlaylist(
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
            const album = await this.playlistService.get(id);
            if (!album) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Album not exists',
                    [],
                );
            }
            await this.playlistService.delete(id);
            return new SuccessResponse({ id });
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }
}
