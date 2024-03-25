export interface IAlbum {
    name: string;
    userId: string;
}

export interface IAlbumCreate {
    deviceId: string;
    name: string;
}

export interface IAlbumAddSong {
    youtubeId: string;
}
