import { HttpStatus } from '@/common/constants';
import { ErrorResponse, SuccessResponse } from '@/common/helpers/response';
import {
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/common/pipe/joi.validation.pipe';
import { recentlyCreateSchema } from './recently.validator';
import { RecentlyService } from './services/recently.service';
import { SongService } from '../song/services/song.service';
import { MusicService } from '../music/services/music.youtube.service';

@Controller('recently')
export class RecentlyController {
    constructor(
        private readonly recentlyService: RecentlyService,
        private readonly songService: SongService,
        private readonly musicService: MusicService,
    ) {}

    @Get('/get/:id/')
    async getDetail(@Param('id') deviceId: string) {
        try {
            const check = await this.recentlyService.checkExisted(deviceId);
            if (!check) {
                await this.recentlyService.create(deviceId);
                return new SuccessResponse([]);
            }
            const data = await this.recentlyService.getDetail(deviceId);
            return new SuccessResponse(data);
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    @Post('/add/:id')
    async create(
        @Param('id') deviceId: string,
        @Body(new JoiValidationPipe(recentlyCreateSchema))
        body: { id: string },
    ) {
        try {
            let songId;
            const song = await this.songService.getByYoutubeId(body?.id);
            if (!song) {
                const data = await this.musicService.getDetail(body.id);
                if (data) {
                    const newSong = await this.songService.create({
                        name: data?.title,
                        artist: data?.artist,
                        youtubeId: body?.id,
                        thumbnails: data?.thumbnails,
                        duration: data?.duration,
                    });
                    songId = newSong?._id;
                } else {
                    return new ErrorResponse(
                        HttpStatus.NOT_FOUND,
                        'Music not exists',
                        [],
                    );
                }
            } else {
                songId = song?._id;
            }
            let songIds = [];
            const recently = await this.recentlyService.getByDeviceId(deviceId);
            if (!recently) {
                const res = await this.recentlyService.create(deviceId);
                songIds = res?.songIds || [];
            } else {
                songIds = recently.songIds || [];
            }
            songIds = songIds?.filter((item) => !item.equals(songId)) || [];
            songIds.unshift(songId);

            const data = await this.recentlyService.updateSongs(
                deviceId,
                songIds,
            );
            return new SuccessResponse(data);
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }

    @Patch('/delete/:id')
    async delete(
        @Param('id')
        deviceId: string,
        @Body()
        body: { id: string },
    ) {
        try {
            const recently = await this.recentlyService.getByDeviceId(deviceId);
            if (!recently) {
                return new ErrorResponse(
                    HttpStatus.NOT_FOUND,
                    'Recently not exists',
                    [],
                );
            }
            const songIds = recently.songIds || [];
            if (!songIds.some((item) => item.equals(body.id))) {
                return new ErrorResponse(
                    HttpStatus.ITEM_NOT_FOUND,
                    'Song not exists',
                    [],
                );
            } else {
                const newSongIds = songIds.filter(
                    (item) => !item.equals(body.id),
                );
                await this.recentlyService.updateSongs(deviceId, newSongIds);
                return new SuccessResponse(true);
            }
        } catch (error) {
            return new InternalServerErrorException(error);
        }
    }
}
