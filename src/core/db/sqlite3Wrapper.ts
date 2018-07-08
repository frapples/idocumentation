import sql from "sql.js";
import fs from "fs";
import BaseException from "@/core/lang/baseException";

// FIXME: Since the node-sqlite3 library is difficult to configure
// This is a temporary implementation that it load the database into memory and open it with sql.js
export default class Sqlite3Wrapper {

    public static of(dbpath: string) {
        if (!Sqlite3Wrapper.cached[dbpath]) {
            Sqlite3Wrapper.cached[dbpath] = new Sqlite3Wrapper(dbpath);
        }
        return Sqlite3Wrapper.cached[dbpath];
    }

    private static cached: { [key: string]: Sqlite3Wrapper } = {};
    private static loadedMemerySize: number = 0;

    private MAX_OPEN_SIZE = 20 * 1024 * 1024;
    private MAX_TOTAL_OPEN_SIZE = 500 * 1024 * 1024;
    private db: sql.Database;

    private constructor(dbpath: string) {
        const size = fs.existsSync(dbpath) ? fs.statSync(dbpath).size : 0;
        if (size === 0) {
            throw new Sqlite3OpenException(`Sqlite database is empty: ${dbpath}`);
        }

        if (size > this.MAX_OPEN_SIZE) {
            throw new Sqlite3OpenException(`Sqlite database too large: ${dbpath},  ${size} > ${this.MAX_OPEN_SIZE}`);
        }

        if (Sqlite3Wrapper.loadedMemerySize + size > this.MAX_TOTAL_OPEN_SIZE) {
            throw new Sqlite3OpenException(
                `Memery limit: max: ${this.MAX_TOTAL_OPEN_SIZE}, now: ${Sqlite3Wrapper.loadedMemerySize}`);
        }

        let data = fs.readFileSync(dbpath);
        Sqlite3Wrapper.loadedMemerySize += size;
        this.db = new sql.Database(data);
    }

    public async exec(sqlStr: string) {
        // FIXME: Although the API is called asynchronously
        // it can only be called synchronously because of the limitation of sql.js.
        let results = this.db.exec(sqlStr);
        let r = results.length === 0 ? { columns: [], values: [] } : results[0];
        return new RowsWrapper(r);
    }
}

type SqljsQueryResults = sql.QueryResults | {columns: string[], values: Array<Array<(number | string | Uint8Array)>> } ;
class RowsWrapper {
    private sqljsResult: SqljsQueryResults;
    private colToIndex: { [key: string]: number } = {};

    public constructor(sqljsResult: SqljsQueryResults) {
        this.sqljsResult = sqljsResult;
        this.columns().forEach((col, i) => {
            this.colToIndex[col] = i;
        });
    }

    public columns() {
        return this.sqljsResult.columns;
    }

    public get(line: number, col: string) {
        return this.sqljsResult.values[line][this.colToIndex[col]];
    }

    public count() {
        return this.sqljsResult.values.length;
    }

    public toArray() {
        let results = [];
        for (let i = 0; i < this.count(); i++) {
            let row = {} as any;
            this.columns().forEach((col) => {
                row[col] = this.get(i, col);
            });
            results.push(row);
        }
        return results;
    }
}

export class Sqlite3OpenException extends BaseException {
}
