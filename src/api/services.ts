import { AxiosResponse } from "axios";
import { apiClient } from "./config";
import { Card, MeResponse, PickupCardResponse, RatingResponse, RequestNewRoom, Response, RoomPreview, UserFieldsMode } from "./types";

type AxiosResponse_<T> = AxiosResponse<Response<T>>
type Promise_<T> = Promise<Response<T>>

export async function users_me(): Promise_<MeResponse> {
    const response: AxiosResponse_<MeResponse> = await apiClient.get('/users/me');
    return response.data;
}

export async function rooms_actives(): Promise_<RoomPreview[]> {
    const response: AxiosResponse_<RoomPreview[]> = await apiClient.get('/rooms/actives');
    return response.data;
}

export async function rooms_new({players_count, room_mode, deck_mode}: RequestNewRoom): Promise_<string> {
    const data = {
        players_count: players_count,
        room_mode: room_mode,
        deck_mode: deck_mode
    }
    const response: AxiosResponse_<string> = await apiClient.post('/rooms/new', data)
    return response.data;
} 

export async function rating(): Promise_<RatingResponse> {
    const response: AxiosResponse_<RatingResponse> = await apiClient.get('/rating/');
    return response.data;
}

export async function users_cards<T extends UserFieldsMode>(
    user_id: 'me' | string, 
    limit: number, 
    offset: number
): Promise_<Card<T>[]> {
    const params = {limit: limit, offset: offset};
    const response: AxiosResponse_<Card<T>[]> = await apiClient.get(`/users/${user_id}/cards`, {params});
    return response.data;
}

export async function cards_default(
    limit: number, 
    offset: number
): Promise_<Card<'other'>[]> {
    const params = {limit: limit, offset: offset};
    const response: AxiosResponse_<Card<'other'>[]> = await apiClient.get('cards/defaults', {params})
    return response.data;
}

export async function cards_delete(card_id: number): Promise_<boolean> {
    const response: AxiosResponse_<boolean> = await apiClient.get(`/cards/${card_id}/delete`);
    return response.data;
}

export async function cards_set_visible(card_id: number, visible: boolean): Promise_<boolean> {
    const params = {visible}
    const response: AxiosResponse_<boolean> = await apiClient.get(`/cards/${card_id}/set_visible`, {params});
    return response.data;
}

export async function generations_create_task(prompt: string) {
    const params = {prompt}
    await apiClient.get('/generations/create_task', {params});
}

export async function generations_my(): Promise_<PickupCardResponse> {
    const response: AxiosResponse_<PickupCardResponse> = await apiClient.get('/generations/my');
    return response.data;
}

export async function generations_pickup_card(prompt: string): Promise_<PickupCardResponse> {
    const params = {prompt}
    const response: AxiosResponse_<PickupCardResponse> = await apiClient.get('/generations/pickup_card', {params});
    return response.data;
}

export async function generations_random_prompt(exclude: string | null = null): Promise_<string | null> {
    const params = {exclude}
    const response: AxiosResponse_<string | null> = await apiClient.get('/generations/random_prompt', {params});
    return response.data;
}

export async function market_get_generations(count: 5 | 10 | 20 | 30): Promise_<number> {
    const params = {count}
    const response: AxiosResponse_<number> = await apiClient.get('/market/get_generations', {params});
    return response.data;
}

export async function market_get_week_premium(): Promise_<number> {
    const response: AxiosResponse_<number> = await apiClient.get('/market/get_week_premium');
    return response.data;
}