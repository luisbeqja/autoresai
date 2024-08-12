import { atom } from "recoil";

export const messageDetailState = atom({
    key: 'messageDetailState', // unique ID (with respect to other atoms/selectors)
    default: {
        isVisible: false,
        messageUser: [''],
        messageBot: [''],
        userName: '',
    }, // default value (aka initial value)
});