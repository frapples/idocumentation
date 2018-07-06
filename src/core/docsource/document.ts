export abstract class Document {
    abstract getDocpath(): string;
    abstract getName(): string;
    abstract getIndexPath(): string ;

}


export interface DocumentType {
    isDocument(docpath: string): boolean;
    typeName(): string;
    createDocument(docpath: string): Document;
}