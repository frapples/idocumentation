import { remote } from "electron";

function homedir() {
    // return os.homedir();
    return remote.app.getPath("home");
}

export default { homedir };