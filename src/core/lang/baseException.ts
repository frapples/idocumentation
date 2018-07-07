export default class BaseException extends Error {
    private msg: string;

    constructor(msg: string) {
        super(msg);
        this.msg = msg;
    }
}