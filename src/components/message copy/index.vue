<template>
  <div
    class="content"
    v-if="msg"
    style="overflow:hidden;background:white;box-shadow:0 0 5px rgba(0,0,0,.1);padding:30px"
  >
    <h1 style="text-align:center;padding:10px">留言板</h1>
    <el-divider></el-divider>
    <div style="text-align:center;margin-bottom:30px">这里是一个留言板,想说什么就在这里留言,欢迎吐槽</div>
    <el-input
      type="textarea"
      resize="none"
      :rows="5"
      show-word-limit
      maxlength="200"
      v-model="fcontent"
    ></el-input>
    <p style="text-align:right">
      <el-button type="primary" @click="addmes()">发表</el-button>
    </p>
    <el-divider></el-divider>

    <div>
      <div style="padding:10px;">
        <h3>目前一共：{{msg.length}}条留言</h3>
        <h5 style="padding:0;margin:0;text-align:right">{{name}}</h5>
      </div>
      <div style="padding:10px">
        <div v-loading="listLoading" style="width:100%;">
          <div v-for="(item,index) in msg" :key="index">
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
                <div style="margin:0 10px;float:left;flex-grow:1;">
                  <div>{{item.fromuser}}</div>
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
                      <el-input v-model="messagecontent" placeholder="请输入内容..."></el-input>
                    </div>
                    <div style="padding-top:5px;display:flex">
                      <div style="margin-left:auto">
                        <el-button type="primary" size="small" @click="add(item)">评论</el-button>
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
                    <el-input v-model="messagecontent" placeholder="请输入内容..."></el-input>
                  </div>
                  <div style="padding-top:5px;display:flex">
                    <div style="margin-left:auto">
                      <el-button type="primary" size="small" @click="add(item)">评论</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { messagelist, addmessage } from "@/api/message";
import comment from "../comment"
import { format } from "@/utils/format.js";
export default {
  components:{
    comment
  },
  data() {
    return {
      msg: "",
      messagecontent: "",
      isshow: "",
      listLoading: true,
      fcontent: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    messagelist()
      .then(res => {
        next(vm => {
          vm.msg = res.data;
          vm.listLoading = false;
        });
      })
      .catch(err => {
        console.log("响应超时");
        console.log(err);
      });
  },
  methods: {
    // 显示留言输入框
    showinput(id) {
      this.isshow = id;
    },
    // 回复留言
    add(item) {
      if (this.$store.state.user.token) {
        var message_id = item.message_id;
        var from_userid = this.$store.state.user.id;
        var to_userid = item.from_userid;
        var content = this.messagecontent;
        addmessage({
          message_id,
          from_userid,
          to_userid,
          content
        })
          .then(res => {
            this.messagelist();
            this.$newmessage("回复成功", "success");
          })
          .catch(err => {
            console.log(err);
            this.$newmessage("回复失败", "error");
          });
      } else {
        this.$newmessage("暂未登录，请登录！", "error");
      }
    },
    // 留言列表
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
    // 格式化时间
    format(time) {
      return format(time);
    },
    // 发表留言
    addmes() {
      if (this.$store.state.user.token) {
        var msg = this.msg;
        var vals = [];
        var getMax = 0;
        for (var i = 0; i < msg.length; i++) {
          // console.log(msg);
          // var vals = [];var vals = [];
          msg.forEach(function(val) {
            vals.push(val.message_id);
          });
          var getMax = Math.max.apply(null, vals);
        }
        var message_id = getMax + 1;
        var from_userid = this.$store.state.user.id;
        var to_userid = 0;
        var content = this.fcontent;
        addmessage({
          message_id,
          from_userid,
          to_userid,
          content
        })
          .then(res => {
            if (res.code) {
              this.messagelist();
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
        this.$newmessage("暂未登录，请登录！", "error");
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
  }
};
</script>


<style>
</style>