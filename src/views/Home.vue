<template>
  <div class="layout">
    <Layout>
      <Header class="layout-header">
        <div class="layout-logo">
          <div class="logo-text">Idocumentation</div>
        </div>
        <div class="layout-nav">
          <Button shape="circle" size="small" icon="gear-b" />
        </div>
      </Header>
      <Layout>
        <Sider hide-trigger class="layout-sidebar">
          <div class="doc-search">
            <Input placeholder="search" />
          </div>
          <div class="doc-list">
            <DocIndexTree/>
          </div>
        </Sider>
        <Layout class="layout-main">
          <Content :style="{padding: '10px',  background: '#fff', height: '100%', width: '100%'}">
            <iframe ref="iframe" @load="onIframeLoad('iframe')" class="doc-frame" src="https://docs.oracle.com/javase/8/docs/api/org/w3c/dom/Document.html"></iframe>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import DocIndexTree from "@/components/DocIndexTree.vue";
import KeyCode from "keycode-js";
import GlobalKeyDownMixin from "@/mixins/globalKeyDownMixin";

export default Vue.extend({
  name: "home",
  mixins: [GlobalKeyDownMixin],
  components: {
    DocIndexTree
  },
  methods: {
  }
});
</script>

<style scoped>
.layout-logo {
  width: 150px;
  height: 35px;

  background: #1cbcd4;
  border-radius: 3px;
  border-radius: 3px;
  position: relative;
  float: left;
  top: 15px;
  left: 20px;
}

.logo-text {
  margin-top: -15px;
  color: #fff;
  font-size: 1.25rem;
}

.layout-nav {
  width: 100px;
  margin: 0 auto;
  margin-right: 20px;
}

.layout-main {
  position: -webkit-sticky;
  position: sticky;
  top: 4rem;
  height: calc(100vh - 4rem - 10px);
}
.layout-sidebar {
  /* min-width: 300px; */
  padding-left: 10px;
  padding-top: 10px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  padding-right: 10px;
  background: #fff;
  position: -webkit-sticky;
  position: sticky;
  top: 4rem;
  height: calc(100vh - 4rem);
}

.layout-header {
  padding-left: 0;
  padding-right: 0;
  background-color: #17a2b8;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
}
.doc-search {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 5px;
  padding-bottom: 5px;
}

.doc-list {
  max-height: calc(100vh - 8rem);
  overflow-y: auto;

  line-height: 1;
  margin-left: -80px;
}

.doc-list >>> ul {
  font-size: 15px;
}

.doc-list >>> li {
  font-size: 15px;
}

.doc-frame {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
