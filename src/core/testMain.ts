import gDocumentLoader from '@/core/docsource/documentLoader';

class TestMain {
    public main() {
        console.log("-------------");
        let documents = gDocumentLoader.documents();
        documents.forEach((doc) => {
            console.log(doc.getName());
            doc.getIndexTypes().then(console.log);
        });

        let document = documents[0];
        document.getIndexsByType("1").then(console.log);
        console.log("-------------");
    }
}

let testMain = new TestMain();
export default testMain;