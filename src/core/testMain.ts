import gDocumentLoader from '@/core/docsource/documentLoader';

class TestMain {
    public main() {
        console.log("-------------");
        let documents = gDocumentLoader.documents();
        console.log(documents);
        console.log("-------------");
    }
}

let testMain = new TestMain();
export default testMain;