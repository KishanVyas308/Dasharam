import {atom} from "recoil";

export const studentsAtom = atom({
    key: "students",
    default: [] as any
})