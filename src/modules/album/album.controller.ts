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
    UseInterceptors,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/common/pipe/joi.validation.pipe';
import { MusicService } from '../music/services/music.youtube.service';
import { IAlbumAddSong, IAlbumCreate } from './album.interface';
import {
    albumAddSongSchema,
    albumCreateSchema,
    albumRemoveSongSchema,
} from './album.validator';
import { AlbumService } from './services/album.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('album')
export class AlbumController {
    constructor(
        private readonly albumService: AlbumService,
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

    @UseInterceptors(CacheInterceptor)
    @Get('/get-detail/:id')
    async getDetail(@Param('id') id: string) {
        try {
            const isExisted = await this.albumService.get(id);
            if (!isExisted) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Album not exists',
                    [],
                );
            }
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
        @Param('id') albumId: string,
        @Body(new JoiValidationPipe(albumAddSongSchema))
        body: IAlbumAddSong,
    ) {
        try {
            const album = await this.albumService.get(albumId);
            if (!album) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Album not exists',
                    [],
                );
            }
            // check youtubeId existed
            const data = await this.musicService.getDetail(body.youtubeId);
            if (!data) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Music not exists',
                    [],
                );
            }
            const result = await this.albumService.addSongIdToAlbum(
                albumId,
                body.youtubeId,
            );
            return new SuccessResponse(result);
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    @Post('/remove-song/:id')
    async removeSong(
        @Param('id') albumId: string,
        @Body(new JoiValidationPipe(albumRemoveSongSchema))
        body: { youtubeId: string },
    ) {
        try {
            const album = await this.albumService.get(albumId);
            if (!album) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Album not exists',
                    [],
                );
            }
            const result = await this.albumService.removeSongIdToAlbum(
                albumId,
                body.youtubeId,
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
