<template>
    <div class="mainContent">
      <div class="upload">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-progress="onProgress"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :on-success="onSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        fileList: [
          {
            name: "food.jpeg",
            url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          },
          {
            name: "food2.jpeg",
            url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
          },
        ],
        acceptFilsLists: [
          ".xls",
          ".xlsx",
          ".doc",
          ".docx",
          ".mp3",
          ".mp4",
          ".jpg",
          ".png",
        ],
        forbidden: "",
      };
    },
    methods: {
      beforeUpload(file, fileList) {
        this.forbidden = true;
        const accept = this.acceptFilsLists.some((x) => {
          return x.split(".")[1] === file.name.split(".")[1];
        });
        let str = this.acceptFilsLists.join("   ");
        if (!accept) {
          this.$message({
            message: `文件格式错误，仅支持上传${str}类型的文件`,
            type: "error",
          });
          this.forbidden = false;
        }
        let size = file.size / 1024 > 500;
        if (size) {
          this.$message({
            message: `文件超出500kb，请重新选择`,
            type: "error",
          });
          this.forbidden = false;
        }
        return this.forbidden;
      },
      onProgress(event, file, fileList) {
        console.log("上传中");
      },
      onSuccess(event, file, fileList) {
        console.log("上传成功");
      },
    },
  };
</script>
