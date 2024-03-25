import { IMusicYoutubeSong, IMusicYoutubeSongDetail } from './music.interface';

export const convertToMusicYoutubeSongList = (
    data: any,
): IMusicYoutubeSong[] => {
    return data?.map((item: any) => {
        return {
            id: item?.id,
            title: item?.title,
            artist: item?.artists?.[0].name,
            thumbnails: item?.thumbnails,
            duration: item?.duration,
        };
    });
};

export const convertToMusicYoutubeSongDetail = (
    id: string,
    url: string,
    data: any,
): IMusicYoutubeSongDetail => {
    return {
        id,
        url,
        title: data?.title,
        artist: data?.author?.name,
        thumbnails: data?.thumbnails,
        duration: data?.lengthSeconds,
    };
};
