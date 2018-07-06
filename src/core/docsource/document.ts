export abstract class Document {

}


export interface DocumentType {
    isDocument(docpath: string): boolean;
    typeName(): string;
    createDocument(docpath: string): Document;
}