import axios from "axios";


export const server = 'imaginegame.326-studio.ru'
// export const server = '127.0.0.1:8000'
const serverHttp: string = `https://${server}`;

export const apiClient = axios.create({
    baseURL: serverHttp,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': window.location.search
    }
});

