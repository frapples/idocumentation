<template>
  <div class="tree">
    <Tree :data="treeData" :load-data="loadData" @on-select-change="onSelect"></Tree>
  </div>
</template>

<script lang="ts">
import Vue, { VNode } from "vue";

import gDocumentLoader from "@/core/docsource/documentLoader";
import { Document } from "@/core/docsource/document";

enum NodeType {
  DOC,
  TYPE,
  ITEM
}

interface Node {
  type: NodeType;
  id: string;
  title: string;
  docIndex: number;
  children: Node[];
  loading: boolean;
  render: any;
}

interface LeafNode {
  type: NodeType;
  id: string;
  title: string;
  docIndex: number;
  path: string;
  render: any;
}

export default Vue.extend({
  name: "DocIndexTree",
  props: {},

  data() {
    return {
      documents: [] as Document[]
    };
  },

  created() {
    this.documents = gDocumentLoader.documents();
  },

  computed: {
    treeData(): any {
      console.log("Return treeData");
      return this.rootData.map((docs) => {
        docs.render = this.createRender("ios-folder-outline");
        docs.children = docs.children.map((type) => {
          type.render = this.createRender("ios-folder-outline");
          type.children = type.children.map((item) => {
            item.render = this.createRender("ios-folder-outline");
            return item;
          });
          return type;
        });
        return docs;
      });
    },

    rootData(): Node[] {
      return this.documents.map((doc, idx) => {
        let name = doc.getName();
        return {
          type: NodeType.DOC,
          id: name,
          docIndex: idx,
          title: doc.getName(),
          loading: false,
          children: [],
          render: null
        };
      });
    }
  },

  methods: {
    render(h: any, { root, node, data }: any, icon: string): VNode {
      return h(
        "span",
        {
          style: {
            display: "inline-block"
          }
        },
        [
          h("span", [
            h("Icon", {
              props: {
                type: icon
              },
              style: {
                marginRight: "8px"
              }
            }),
            h("span", data.title)
          ])
        ]
      );
    },

    createRender(icon: string) {
      return (h: any, { root, node, data }: any) => {
        return this.render(h, { root, node, data }, icon);
      };
    },

    loadData(item: Node, callback: (data: any) => void) {
      if (item.type === NodeType.DOC) {
        this.documents[item.docIndex].getIndexTypes().then((types) => {
          let data = types.map((type) => {
            return {
              type: NodeType.TYPE,
              id: type.id,
              docIndex: item.docIndex,
              title: type.name,
              loading: false,
              children: [],
              render: null
            };
          });
          callback(data);
        });
      }

      if (item.type === NodeType.TYPE) {
        this.documents[item.docIndex].getIndexsByType(item.id).then((indexs) => {
          let data = indexs.map((index) => {
            return {
              type: NodeType.ITEM,
              id: index.id,
              path: index.path,
              docIndex: item.docIndex,
              title: index.name,
              render: null
            } as LeafNode;
          });
          console.log("Loading Node:" + item.title);
          callback(data);
        });
      }

    },

    onSelect(nodes: Array<Node | LeafNode>) {
      nodes = nodes.filter((n) => n.type === NodeType.ITEM);
      if (nodes.length > 0) {
        let node = nodes[0] as LeafNode;
        let url = this.documents[node.docIndex].getUrl(node.path);
        this.$emit("document-url-change", url);
    }
  }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tree {
  text-align: left;
}

/*
.tree >>> .ivu-tree li ul {
  padding-left: 35px;
}
*/
</style>
