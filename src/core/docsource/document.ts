export abstract class Document {
    public abstract getDocpath(): string;
    public abstract getName(): string;
    public abstract getIndexPath(): string;
    public abstract getIndexTypes(): Array<{ id: string, name: string }>;

}


export interface DocumentType {
    isDocument(docpath: string): boolean;
    typeName(): string;
    createDocument(docpath: string): Document;
}