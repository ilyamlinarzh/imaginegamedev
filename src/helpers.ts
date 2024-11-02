import { monthsShortAlias } from "./consts"

export function getDateValue(time: string) {
    const date = new Date(time)
    const day = date.getDate()
    const month_i = date.getMonth()
    const year = date.getFullYear()

    return `${day} ${monthsShortAlias[month_i]} ${year}`
}

export async function loadImage(url: string) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;

        img.onload = () => {
            resolve(url); // Успешная загрузка
        };

        img.onerror = () => {
            reject(new Error('Ошибка загрузки изображения')); // Ошибка загрузки
        };
    });
}

export function declOfNum(number: number, titles: [string, string, string]) {  
    var cases = [2, 0, 1, 1, 1, 2];  
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
}