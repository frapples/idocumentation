import os from "os";
import fs from "fs";
import path from "path";
import fsUtils from "@/core/utils/fsUtils";

class DocsetLoader {
    constructor() {
        console.log(fs);
        let result = fs.readdirSync(this.docsetDirectory());
        console.log(result);
    }

    docsetDirectory() {
        return path.join(fsUtils.homedir(), ".idocumentation", "docsets");
    }
}

const docsetLoader = new DocsetLoader();
export default docsetLoader;