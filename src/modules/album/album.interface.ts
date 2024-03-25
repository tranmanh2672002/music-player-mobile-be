export interface IAlbum {
    name: string;
    userId: string;
}

export interface IAlbumCreate {
    name: string;
}

export interface IAlbumAddSong {
    youtubeId: string;
}
