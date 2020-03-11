<template>
  <div style="overflow:hidden;background:white;box-shadow:0 0 5px rgba(0,0,0,.1);" class="content">
    <div style="margin:30px;">
      <el-timeline>
        <el-timeline-item>
          <h1>目前一共{{total}}篇文章</h1>
        </el-timeline-item>
        <el-timeline-item
          v-for="(item,index) in history"
          :key="index"
          :timestamp="format(item.date)"
        >
          <router-link
            :to="'/article/'+item.id"
            style="text-decoration:none;font-size:18px"
          >{{item.title}}</router-link>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { articlelist } from "../../api/article";
import { format } from "@/utils/format.js";
export default {
  data() {
    return {
      history: null,
      total: null
    };
  },
  methods: {
    // 格式化时间
    format(time) {
      return format(time);
    }
  },
  beforeRouteEnter(to, from, next) {
    articlelist({
      ordername: "date",
      orderby: "desc"
    }).then(res => {
      next(vm => {
        vm.history = res.list.rows;
        vm.total = res.list.count;
      });
    });
  },
  created() {},
  mounted() {},
  computed: {}
};
</script>

<style>
</style>