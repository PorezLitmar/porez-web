export const DialogType = {
    INFO: "INFO",
    OK_CANCEL: "OK_CANCEL",
    YES_NO: "YES_NO",
} as const;

export type DialogType = (typeof DialogType)[keyof typeof DialogType];

export const DialogAnswer = {
    OK: "OK",
    CANCEL: "CANCEL",
    YES: "YES",
    NO: "NO",
} as const;

export type DialogAnswer = (typeof DialogAnswer)[keyof typeof DialogAnswer];

export interface DialogData {
    type: DialogType,
    title?: string,
    message?: string,
    callback: (answer: DialogAnswer) => void
}

export interface DialogState {
    modalRoot: HTMLElement | null,
    showDialog: (data: DialogData) => void
}
