import os from "os";
import fs from "fs";
import path from "path";
import fsUtils from "@/core/utils/fsUtils";

import {Document, DocumentType } from "./document";
import gDocumentTypes from "./documentTypes";


class DocumentLoader {
    private documentTypes: DocumentType[] = [];

    public constructor(documentTypes: DocumentType[]) {
        this.documentTypes = documentTypes;
    }

    public documentDirectory() {
        return path.join(fsUtils.homedir(), ".idocumentation", "docsets");
    }

    public documents() {
        let result: String[];
        if (fs.existsSync(this.documentDirectory())) {
            result = fs.readdirSync(this.documentDirectory());
        } else {
            result = [];
        }

        let documents = result.map((name) => this.loadDocument(name.toString())).filter((d) => d != null);
        return documents as Document[];
    }

    private loadDocument(name: string) {
        let docpath = path.join(this.documentDirectory(), name);
        let docs = this.documentTypes.map((t) => {
            if (t.isDocument(docpath)) {
                return t.createDocument(docpath);
            }
        })
        return docs[0] || null;
    }

}


const documentLoader = new DocumentLoader(gDocumentTypes);
export default documentLoader;