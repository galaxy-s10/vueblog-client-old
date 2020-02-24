<template>
  <div>
    <article v-for="(item,index) in pagelist" :key="index" class="article-con">
      <div class="article-l">
        <router-link
          v-if="item.img!=null"
          :to="'/article/'+item.id"
          tag="div"
          :style="{backgroundImage: 'url'+ '('+item.img+')'}"
          class="img"
        />
        <router-link
          v-else
          :to="'/article/'+item.id"
          tag="div"
          :style="{backgroundImage:nopic}"
          class="img"
        />
      </div>
      <div class="article-r">
        <router-link :to="'/article/'+item.id" tag="h2" class="overtext">{{item.title}}</router-link>
        <el-divider></el-divider>
        <p>暂时无可提供的摘要</p>
        <p style="font-size:12px">
          <span class="jgh">{{format1(item.date)}}</span>
          <span class="jgh">{{item.click}}次浏览</span>
          <span>{{item.Comments.length}}条评论</span>
        </p>
      </div>
    </article>
    <div style="text-align:center;padding:30px 0">
      <!-- <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pagesize"
        @current-change="currentchange"
      ></el-pagination>-->
      <page :total="total" :pagesize="pagesize" @currentchange="currentchange" />
    </div>
  </div>
</template>

<script>
import page from "../page/index";
import { articlelist, articlepage } from "@/api/article";
import { format, format1 } from "@/utils/format.js";
export default {
  components: {
    page
  },
  data() {
    return {
      nopic: "url(" + require("../../assets/imgs/无图.png") + ")",
      visible: false
      // type: [{ type: "全部" }, { type: "前端" }, { type: "后端" }]
    };
  },
  methods: {
    // 格式化时间
    format1(time) {
      return format1(time);
    },
    // currentPage 改变时会触发
    currentchange(nowpage) {
      this.$store.commit("nowpage", nowpage);
      this.$store.dispatch("articlepage", {
        nowpage,
        type: this.$store.state.article.type
      });
    },
    headershow() {
      // 头部高度为70px
      const height = 70;
      const offsetTop =
        window.pageYOffset || document.documentElement.scrollTop;
      this.visible = offsetTop > height;
    },
    hello(x) {
      this.$store.dispatch("articlelist", { type: x });
    }
  },
  created() {
    // this.$store.commit('nowtype',null)
    this.$store.commit("nowpage", 1);
    this.$store.dispatch("articlepage", { nowpage: 1 });
  },
  mounted() {
    window.addEventListener("scroll", this.headershow);
  },
  destroyed() {
    window.removeEventListener("scroll", this.headershow);
  },
  computed: {
    // fetch() {
    //   this.$store.dispatch("articlepage", { pagesize: 3, nowpage: 1 });
    // },
    pagelist() {
      return this.$store.state.article.pagelist;
    },
    total() {
      return this.$store.state.article.count;
    },
    pagesize() {
      return this.$store.state.article.pagesize;
    },
    nowpage() {
      return this.$store.state.article.nowpage;
    },
    nowtype() {
      return this.$store.state.article.nowtype;
    }
  },
  watch: {
    nowtype(newval, oldval) {
      this.$store.dispatch("articlepage", { nowpage: 1 });
    }
  }
};
</script>

<style scoped>
.v-enter {
  transform: translateX(-10px);
  opacity: 0;
}
.v-enter-active {
  transition: all 0.5s ease;
}
.jgh::after {
  content: "·";
  font-weight: 600;
  padding: 0 5px;
}
.img {
  background-position: 50% 50%;
  background-size: cover;
  height: 100%;
  width: 100%;
  transition: all 0.3s;
}
.article-con {
  display: flex;
  width: 100%;
  background: white;
  margin-bottom: 15px;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
}
.article-l {
  flex: 0 0 40%;
  margin: 20px;
}
.article-r {
  box-sizing: border-box;
  padding: 30px;
  overflow: hidden;
}
</style>
