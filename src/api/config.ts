import axios from "axios";


export const server = 'imaginegame.326studio.ru'
const serverHttp: string = `https://${server}`;

export const apiClient = axios.create({
    baseURL: serverHttp,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': window.location.search
    }
});

