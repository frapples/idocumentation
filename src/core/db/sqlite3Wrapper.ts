import sql from "sql.js";
import fs from "fs";

export default class Sqlite3Wrapper {
    public static of(dbpath: string) {
        if (!Sqlite3Wrapper.cached[dbpath]) {
            Sqlite3Wrapper.cached[dbpath] = new Sqlite3Wrapper(dbpath);
        }
        return Sqlite3Wrapper.cached[dbpath];
    }

    private static cached: { [key: string]: Sqlite3Wrapper } = {};

    private db: sql.Database;

    private constructor(dbpath: string) {
        let data = fs.readFileSync(dbpath);
        this.db = new sql.Database(data);
    }

    public exec(sqlStr: string) {
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