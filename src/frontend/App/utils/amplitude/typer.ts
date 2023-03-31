export type NavigereTabEvent = {
    side: string;
    forrigeFane: string;
    nesteFane: string;
    behandlingStatus?: string;
    behandlingSteg?: string;
};

export type BesøkEvent = {
    side: string;
    fane?: string;
};
