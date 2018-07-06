export abstract class Document {
    abstract getDocpath(): string;
    abstract getName(): string;
    abstract getIndexPath(): string;
    abstract getIndexTypes(): { id: string, name: string }[];

}


export interface DocumentType {
    isDocument(docpath: string): boolean;
    typeName(): string;
    createDocument(docpath: string): Document;
}