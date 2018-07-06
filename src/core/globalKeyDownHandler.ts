import KeyCode from "keycode-js";
import gTestMain from "@/core/testMain";

class GlobalKeyDownHandler {
    public handle(event: KeyboardEvent) {
        if (event.ctrlKey && event.keyCode === KeyCode.KEY_T) {
            this.handleCtrlT();
        }
    }

    public handleCtrlT() {
        gTestMain.main();
    }

}

let globalKeyDownHandler = new GlobalKeyDownHandler();
export default globalKeyDownHandler;