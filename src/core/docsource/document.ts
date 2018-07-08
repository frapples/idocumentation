export abstract class Document {
    public abstract getDocpath(): string;
    public abstract getName(): string;
    public abstract getIndexPath(): string;
    public abstract getUrl(path: string): string;
    public abstract async getIndexTypes(): Promise<Array<{ id: string, name: string }>>;
    public abstract async getIndexsByType(typeId: string): Promise<Array<{ id: string, name: string, path: string }>>;

}


export interface DocumentType {
    isDocument(docpath: string): boolean;
    typeName(): string;
    createDocument(docpath: string): Document;
}