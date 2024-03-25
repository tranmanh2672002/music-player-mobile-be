import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWinstonLogger } from 'src/common/services/winston.service';
import { MODULE_NAME } from '../album.constant';
import { AlbumRepo } from '@/repositories/album.repo';
import { IAlbumCreate } from '../album.interface';
import { MusicService } from '@/modules/music/services/music.youtube.service';

@Injectable()
export class AlbumService {
    constructor(
        private readonly configService: ConfigService,
        private readonly musicService: MusicService,
        private readonly albumRepo: AlbumRepo,
    ) {}
    private readonly logger = createWinstonLogger(
        MODULE_NAME,
        this.configService,
    );

    async getList(deviceId: string) {
        try {
            const albums = await this.albumRepo.find({ deviceId });
            return albums;
        } catch (error) {
            this.logger.error('Error get list in album service', error);
            throw error;
        }
    }

    async getDetail(id: string) {
        try {
            const album = await this.albumRepo.findById(id).lean();
            if (album.songIds?.length) {
                const { songIds, ...rest } = album;
                const songs = await Promise.all(
                    songIds.map((id: string) => {
                        return this.musicService.getDetail(id);
                    }),
                );
                return {
                    ...rest,
                    songs,
                };
            }
            return album;
        } catch (error) {
            this.logger.error('Error get in album service', error);
            throw error;
        }
    }

    async get(id: string) {
        try {
            const album = await this.albumRepo.findById(id);
            return album;
        } catch (error) {
            this.logger.error('Error get in album service', error);
            throw error;
        }
    }

    async isExistedByDeviceId(id: string) {
        try {
            const album = await this.albumRepo.findOne({ deviceId: id });
            return album;
        } catch (error) {
            this.logger.error(
                'Error isExistedByDeviceId in album service',
                error,
            );
            throw error;
        }
    }

    async create(data: IAlbumCreate) {
        try {
            const album = await this.albumRepo.create(data);
            return album;
        } catch (error) {
            this.logger.error('Error create in album service', error);
            throw error;
        }
    }

    async delete(id: string) {
        try {
            await this.albumRepo.delete({ _id: id });
            return id;
        } catch (error) {
            this.logger.error('Error delete in album service', error);
            throw error;
        }
    }

    async addSongIdToAlbum(albumId: string, songId: string) {
        try {
            const result = await this.albumRepo.findByIdAndUpdate(
                albumId,
                { $addToSet: { songIds: songId } },
                { new: true },
            );
            return result;
        } catch (error) {
            this.logger.error(
                'Error add song to album in album service',
                error,
            );
            throw error;
        }
    }

    async removeSongIdToAlbum(albumId: string, songId: string) {
        try {
            const result = await this.albumRepo.findByIdAndUpdate(
                albumId,
                { $pull: { songIds: songId } },
                { new: true },
            );
            return result;
        } catch (error) {
            this.logger.error(
                'Error remove song to album in album service',
                error,
            );
            throw error;
        }
    }
}
