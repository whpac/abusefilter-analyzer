/**
 * A simple class modelling a parser exception.
 */
export class ParserException extends Error {
    public constructor(message: string, public position: number, public readonly data: (string | number)[]) {
        super(message);
    }

    public toString(): string {
        return `ParserException: ${this.message} at position ${this.position} with data: ${this.data.join(', ')}`;
    }
}