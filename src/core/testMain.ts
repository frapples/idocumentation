import gDocumentLoader from '@/core/docsource/documentLoader';

class TestMain {
    public main() {
        console.log("-------------");
        let documents = gDocumentLoader.documents();
        documents.forEach((doc) => {
            console.log(doc.getName());
            console.log(doc.getIndexTypes());
        });

        let document = documents[0];
        console.log(document.getIndexsByType("1"));
        console.log("-------------");
    }
}

let testMain = new TestMain();
export default testMain;