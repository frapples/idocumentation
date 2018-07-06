<template>
    <div class="tree">
        <Tree :data="treeData"></Tree>
    </div>
</template>

<script lang="ts">
import Vue, { VNode } from "vue";

export default Vue.extend({
  name: "DocIndexTree",
  props: {},

  data() {
    return {
      data: [
        {
          title: "parent 1",
          expand: true,
          children: [
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-2",
              expand: true,
              children: [
                {
                  title: "leaf 1-2-1"
                },
                {
                  title: "leaf 1-2-1"
                }
              ]
            }
          ]
        }
      ]
    };
  },

  computed: {
    treeData(): any {
      return this.data.map((docs) => {
        (docs as any).render = this.createRender("ios-folder-outline");
        docs.children = docs.children.map((type) => {
          (type as any).render = this.createRender("ios-folder-outline");
          type.children = type.children.map((item) => {
              (item as any).render = this.createRender("ios-folder-outline");
              return item;
          });
          return type;
        });
        return docs;
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
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tree >>> .ivu-tree li ul {
  padding-left: 35px;
}
</style>
