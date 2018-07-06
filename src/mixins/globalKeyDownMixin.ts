import Vue from "vue";
import globalKeyDownHandler from "@/core/globalKeyDownHandler";

export default Vue.extend({
    created() {
        window.addEventListener("keydown", this.onKeyDown);
    },

    methods: {
        onKeyDown(event: KeyboardEvent) {
            globalKeyDownHandler.handle(event);
        },

        onIframeLoad(refName: string) {
            // FIXME: cross-origin frame.
            let iframe = this.$refs[refName] as HTMLIFrameElement | null;

            if (!iframe) {
                console.error("Iframe DOM is empty");
            }

            iframe!.contentWindow!.addEventListener("keydown", this.onKeyDown);
        }
    }
});