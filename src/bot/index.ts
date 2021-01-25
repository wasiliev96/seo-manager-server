import {Telegraf} from 'telegraf';

const bot = new Telegraf(`1584456607:AAEikLqGus-wBBMtWkFgPVxNCbBduI_k17c`);

export const sendMessage = async (message: string) => {
    return await bot.telegram.sendMessage(-1001166376748, message);
};
