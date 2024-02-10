/**
 * A simple class modelling a parser exception.
 */
export class ParserException extends Error {
    public constructor(message: string, public position: number, public readonly data: (string | number)[]) {
        super(message);
    }
}