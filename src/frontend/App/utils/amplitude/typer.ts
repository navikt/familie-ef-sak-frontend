export type NavigereTabEvent = {
    side: string;
    fane: string;
    behandlingStatus?: string;
    behandlingSteg?: string;
};

export type BesøkEvent = {
    side: string;
    fane?: string;
};
