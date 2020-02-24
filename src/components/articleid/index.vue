<template>
  <div :key="key">
    <div v-for="(item,index) in data" :key="index" class="content">
      <div style="padding:20px 30px 50px 30px;overflow:hidden">
        <h1 style="margin:20px 0 10px;text-align:center">{{item.title}}</h1>
        <p style="text-align:center;font-size:12px">
          <span class="el-icon-date" style="margin-right:4px"></span>
          {{format(item.date)}}
        </p>
        <p style="font-size:12px;text-align:center;margin-bottom:20px;">
          <span class="el-icon-view"></span>
          {{item.click}}浏览
        </p>
        <img v-if="item.img!=null" :src="item.img" alt="item.img" width="100%" height="460" />
        <img v-else src="../../assets/imgs/无图.png" alt />
        <div>
          <div class="mce-content-body" v-html="item.content"></div>
          <!-- <div v-html="item.content"></div> -->
        </div>
        <div style="text-align:right;font-size:14px;">最后更新于：{{format(item.updatedAt)}}</div>
      </div>
      <el-divider>评论一下吧 ！</el-divider>
      <div>
        <el-input
          type="textarea"
          resize="none"
          :rows="5"
          show-word-limit
          maxlength="200"
          v-model="content"
        ></el-input>
        <p style="text-align:right">
          <el-button type="primary" @click="addcomment()">评论</el-button>
        </p>
        <comment :list="list" :count="count" @reshow="commentlist" />
      </div>
    </div>
  </div>
</template>

<script>
import Prism from "../../assets/prismjs/prism.js";
import comment from "../comment";
import { findarticle } from "@/api/article";
import { commentlist, addcomment } from "@/api/comment";
import { format, format1 } from "@/utils/format.js";
export default {
  components: {
    comment
  },
  data() {
    return {
      list: "",
      count: null,
      comment: "",
      content: "",
      data: null
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.articleinfo(to.params.id);
    this.commentlist(to.params.id);
    next();
  },
  methods: {
    // 格式化日期时间
    format(time) {
      return format(time);
    },
    // 提交留言
    addcomment() {
      if (this.$store.state.user.token) {
        var article_id = this.$route.params.id;
        var from_userid = this.$store.state.user.token;
        var content = this.content;
        var to_commentid = -1;
        var to_username = null;
        var date = new Date();
        var date = format(date);
        addcomment({
          article_id,
          from_userid,
          content,
          to_commentid,
          to_username,
          date
        })
          .then(res => {
            if (res) {
              this.commentlist(this.$route.params.id);
              this.$newmessage("发表成功！", "success");
            } else {
              this.$newmessage(res.data, "success");
            }
          })
          .catch(err => {
            console.log("err");
            this.$newmessage("发表失败！", "error");
          });
      } else {
        this.$newmessage("暂未登录，请登录！", "warning");
      }
    },
    // 文章留言列表
    commentlist(id) {
      commentlist(id)
        .then(res => {
          this.list = res.lists;
          this.count = res.count;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 文章信息
    articleinfo(id) {
      findarticle(id).then(res => {
        this.data = res.list.rows;
        setTimeout(() => {
          Prism.highlightAll();
        }, 0);
      });
    }
  },
  created() {},
  mounted() {
    this.articleinfo(this.$route.params.id);
    this.commentlist(this.$route.params.id);
  },
  computed: {
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style scoped>
@import "../../assets/tinymce/skins/content/default/content.css";
@import "../../assets/prismjs/prism.css";
</style>