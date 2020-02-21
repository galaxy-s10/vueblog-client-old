<template>
  <div>
    <div v-if="message.length">
      <div style="padding:10px;">
        <h3>目前一共：{{message.length}}条留言</h3>
        <h5 style="padding:0;margin:0;text-align:right">{{name}}</h5>
      </div>
      <div style="padding:10px">
        <div v-loading="listLoading" style="width:100%;">
          <div v-for="(item,index) in message" :key="index">
            <!-- 作者 -->
            <div v-if="item.touser=='无'">
              <div style="overflow:hidden;display:flex">
                <!-- 作者头像，ID -->
                <div style="overflow:hidden">
                  <div style="float:left;width:30px;height:30px;">
                    <el-avatar>
                      <img class="userlogo" :src="item.avatar" />
                    </el-avatar>
                  </div>
                </div>
                <!-- 名字，内容，时间 -->
                <div style="flex-grow:1;">
                  <div>{{item.from_user.username}}</div>
                  <div style="margin-top:3px">{{item.content}}</div>
                  <div style="margin:10px 0">
                    <span class="el-icon-date">{{format(item.date)}}</span>
                    <span style="float:right;">
                      <i class="el-icon-chat-round" style="cursor:pointer"></i>
                      <span style="margin-left:10px;cursor:pointer" @click="showinput(item.id)">回复</span>
                    </span>
                  </div>
                  <div
                    style="background:#fafbfc;padding:10px;margin-bottom:5px"
                    v-show="item.id == isshow"
                  >
                    <div>
                      <el-input v-model="content" placeholder="请输入内容..." maxlength="50" show-word-limit></el-input>
                    </div>
                    <div style="padding-top:5px;display:flex">
                      <div style="margin-left:auto">
                        <el-button type="primary" size="small" @click="add(item,article_id)">评论</el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 回复作者 -->
            <div v-else style="background:#fafbfc;overflow:hidden;margin-left:30px;display:flex">
              <!-- 回复人头像 -->
              <div style="float:left;">
                <el-avatar>
                  <img class="userlogo" :src="item.avatar" />
                </el-avatar>
              </div>
              <!-- 名字，内容，时间 -->
              <div style="border-bottom:1px solid #f1f1f1;margin:0 10px;float:left;flex-grow:1">
                <div>{{item.fromuser}}</div>
                <div style="margin-top:3px">回复{{item.touser}}:{{item.content}}</div>
                <div style="margin:10px 0">
                  <span class="el-icon-date">{{format(item.date)}}</span>
                  <span style="float:right;">
                    <i class="el-icon-chat-round" style="cursor:pointer"></i>
                    <span style="margin-left:10px;cursor:pointer" @click="showinput(item.id)">回复</span>
                  </span>
                </div>
                <div
                  style="background:white;padding:10px;margin-bottom:5px"
                  v-if="item.id == isshow"
                >
                  <div>
                    <el-input type="text" v-model="content" placeholder="请输入内容..." maxlength="50" show-word-limit></el-input>
                  </div>
                  <div style="padding-top:5px;display:flex">
                    <div style="margin-left:auto">
                      <el-button type="primary" size="small" @click="add(item,article_id)">评论</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else style="text-align:center;padding:40px 0">
      <h5 style="padding:0;margin:0;text-align:right">{{name}}</h5>目前还没有人留言~
    </div>
  </div>
</template>

<script>
import {
  messagelist,
  commentlist,
  addmessage,
  addcomment
} from "@/api/comment";
import { format } from "@/utils/format.js";
export default {
  props: ["message", "article_id"],
  data() {
    return {
      newdata: this.message,
      listLoading: false,
      content: "",
      isshow: ""
    };
  },
  methods: {
    // 显示留言输入框
    showinput(id) {
      this.isshow = id;
    },
    format(time) {
      return format(time);
    },
    // 留言板留言列表
    messagelist() {
      this.listLoading = true;
      messagelist()
        .then(res => {
          this.msg = res.data;
          this.listLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 文章留言列表
    commentlist(article_id) {
      this.listLoading = true;
      commentlist(article_id)
        .then(res => {
          this.newdata = res.data;
          this.listLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 回复留言
    add(item, article_id) {
      if (this.$store.state.user.token) {
        var message_id = item.message_id;
        var from_userid = this.$store.state.user.id;
        var to_userid = item.from_userid;
        var content = this.content;
        var date = new Date();
        var date = format(date);
        if (article_id == 0) {
          addmessage({
            message_id,
            from_userid,
            to_userid,
            content,
            date
          })
            .then(res => {
              this.$emit("reshow");
              this.messagelist();
              this.$newmessage("回复成功", "success");
            })
            .catch(err => {
              console.log(err);
              this.$newmessage("回复失败", "error");
            });
        } else {
          addcomment({
            article_id,
            message_id,
            from_userid,
            to_userid,
            content,
            date
          })
            .then(res => {
              this.$emit("reshow");
              this.commentlist(article_id);
              this.$newmessage("回复成功", "success");
            })
            .catch(err => {
              console.log(err);
              this.$newmessage("回复失败", "error");
            });
        }
      } else {
        this.$newmessage("请先登录~", "warning");
      }
    }
  },
  computed: {
    name() {
      if (this.$store.state.user.token) {
        return "已登录：" + this.$store.state.user.name;
      } else {
        return "未登录";
      }
    }
  },
  mounted() {
    // messagelist()
    //   .then(res => {
    //       console.log("res");
    //       this.newdata = res.data;
    //       this.listLoading = false;
    //   })
    //   .catch(err => {
    //     console.log("响应超时");
    //     console.log(err);
    //   });
  }
};
</script>


<style>
</style>