import path from "path";
import fs from "fs";
import plist from "plist";
import { Document, DocumentType } from "../document";

class DocsetDocument extends Document {
    private docpath: string;
    private plist: any = null;

    public constructor(docpath: string) {
        super();
        this.docpath = docpath;
        this.loadPlist();
    }

    public getDocpath() {
        return this.docpath;
    }

    public getName(): string {
        return this.plist.CFBundleName;
    }

    public getIndexPath(): string {
        return this.plist.dashIndexFilePath || "";
    }

    private loadPlist() {
        let plistPath = path.join(this.docpath, "Contents", "Info.plist");
        this.plist = plist.parse(fs.readFileSync(plistPath, 'utf8'));
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