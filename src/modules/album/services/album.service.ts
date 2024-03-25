import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWinstonLogger } from 'src/common/services/winston.service';
import { MODULE_NAME } from '../album.constant';
import { AlbumRepo } from '@/repositories/album.repo';

@Injectable()
export class PlaylistService {
    constructor(
        private readonly configService: ConfigService,
        private readonly albumRepo: AlbumRepo,
    ) {}
    private readonly logger = createWinstonLogger(
        MODULE_NAME,
        this.configService,
    );

    async getList(userId: string) {
        try {
            const playlists = await this.albumRepo.find({ userId });
            return playlists;
        } catch (error) {
            this.logger.error('Error get list in album service', error);
            throw error;
        }
    }

    async getDetail(id: string) {
        try {
            const album = await this.albumRepo.findById(id).populate('songIds');
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

    async create(userId: string, name: string) {
        try {
            const album = await this.albumRepo.create({ userId, name });
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

    async addSongIdToPlaylist(playlistId: string, songId: string) {
        try {
            const result = await this.albumRepo.findByIdAndUpdate(
                playlistId,
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

    async removeSongIdToPlaylist(playlistId: string, songId: string) {
        try {
            const result = await this.albumRepo.findByIdAndUpdate(
                playlistId,
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
