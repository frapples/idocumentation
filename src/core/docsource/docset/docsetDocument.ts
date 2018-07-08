import path from "path";
import fs from "fs";
import plist from "plist";
import { Document, DocumentType } from "../document";
// import sqlite3 from "sqlite3";
import Sqlite3Wrapper from "@/core/db/sqlite3Wrapper";

class DocsetDocument extends Document {
    private docpath: string;
    private plist: any = null;
    private indexDb: Sqlite3Wrapper;

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

    public getUrl(docPath: string): string {
        return "file://" + path.join(this.getDocpath(), "Contents/Resources/Documents", docPath);
    }

    public async getIndexTypes() {
        let rows = await this.indexDb.exec("SELECT Z_PK as typeid, ZTYPENAME as typename FROM ZTOKENTYPE");
        return rows.toArray().map((row) => {
            return { id: row.typeid as string, name: row.typename as string };
        });
    }

    public async getIndexsByType(typeId: string) {
        let nid = Number(typeId);
        let sqlStr = `SELECT DISTINCT
            ztoken.z_pk AS id,
            ztokenname AS name,
            zpath AS path,
            zanchor AS fragment
        FROM ztoken, ztokenmetainformation, zfilepath, ztokentype
        WHERE ztoken.zmetainformation = ztokenmetainformation.z_pk AND
            ztokenmetainformation.zfile = zfilepath.z_pk AND
            ztoken.ztokentype = ${nid}`;

        let rows = await this.indexDb.exec(sqlStr);
        return rows.toArray().map((row) => {
            return { id: row.id as string, name: row.name as string, path: row.path as string };
        });
    }

    private loadPlist() {
        let plistPath = path.join(this.docpath, "Contents", "Info.plist");
        return plist.parse(fs.readFileSync(plistPath, 'utf8'));
    }

    private loadIndexDb() {
        let indexDbPath = path.join(this.docpath, "Contents", "Resources", "docSet.dsidx");
        // return sqlite3.cached.Database(indexDbPath, sqlite3.OPEN_READONLY);
        return Sqlite3Wrapper.of(indexDbPath);
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