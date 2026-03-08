import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Game {
    id: bigint;
    url: string;
    name: string;
    description: string;
    category: string;
}
export interface backendInterface {
    addGame(name: string, url: string, category: string, description: string): Promise<bigint>;
    getAllGames(): Promise<Array<Game>>;
    getGame(id: bigint): Promise<Game | null>;
    getGamesByCategory(category: string): Promise<Array<Game>>;
}
