export interface IMusicSearchQuery {
    keyword: string;
}

export interface IMusicYoutubeSong {
    id: string;
    title: string;
    artist: string;
    thumbnails: {
        url: string;
        width: number;
        height: number;
    }[];
    duration: number;
}

export interface IMusicYoutubeSongDetail {
    id: string;
    url: string;
    title: string;
    artist: {
        id: string;
        name: string;
        thumbnails: {
            url: string;
            width: number;
            height: number;
        }[];
    };
    thumbnails: {
        url: string;
        width: number;
        height: number;
    }[];
    duration: number;
}
