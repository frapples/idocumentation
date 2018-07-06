import gDocumentLoader from '@/core/docsource/documentLoader';

class TestMain {
    public main() {
        console.log("-------------");
        let documents = gDocumentLoader.documents();
        documents.forEach(doc => {
            console.log(doc.getName());
        });
        console.log("-------------");
    }
}

let testMain = new TestMain();
export default testMain;