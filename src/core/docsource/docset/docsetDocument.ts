import path from "path";
import { Document, DocumentType } from "../document";

class DocsetDocument extends Document {
    private docpath: string;

    public constructor(docpath: string) {
        super();
        this.docpath = docpath;
    }

    public getName() {
        return path.basename(this.docpath);
    }

}

class DocsetDocumentType implements DocumentType {
    public isDocument(docpath: string): boolean {
        let name = path.basename(docpath);
        let sufix = name.split(".").reverse()[0];
        return sufix === "docset";
    }

    public typeName(): string {
        return "docset";
    }

    public createDocument(docpath: string) {
        return new DocsetDocument(docpath);
    }

}

let docsetDocumentType = new DocsetDocumentType();

export { DocsetDocument, docsetDocumentType };