export interface PensjonsgivendeInntekt {
    inntektsår: string;
    næring: number;
    person: number;
    svalbard?: {
        næring: number;
        person: number;
    };
}
