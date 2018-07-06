import path from "path";
import fs from "fs";
import plist from "plist";
import { Document, DocumentType } from "../document";
import sqlite3 from "sqlite3";

class DocsetDocument extends Document {
    private docpath: string;
    private plist: any = null;
    private indexDb: sqlite3.Database;

    public constructor(docpath: string) {
        super();
        this.docpath = docpath;
        this.plist = this.loadPlist();
        this.indexDb = this.loadIndexDb();
        this.getIndexTypes();
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

    public getIndexTypes() {
        this.indexDb.all("SELECT Z_PK as typeid, ZTYPENAME as typename FROM ZTOKENTYPE", (err, rows) => {
            console.log(rows);
        })
    }

    private loadPlist() {
        let plistPath = path.join(this.docpath, "Contents", "Info.plist");
        return plist.parse(fs.readFileSync(plistPath, 'utf8'));
    }

    private loadIndexDb() {
        let indexDbPath = path.join(this.docpath, "Contents", "Resources", "docSet.dsidx");
        return sqlite3.cached.Database(indexDbPath, sqlite3.OPEN_READONLY);
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