<template>
  <div @click.self="closeClick" class="Mongolia">
    
    <div class="content">
      <div @click="closeClick" class="close">×</div>
      <slot name="container"></slot>
    </div>
    <div class="logistics">
      <slot name="logistics"></slot>
        <div @click="closeClick" class="close">×</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeClick() {
      this.$emit("closeMongolia", "");
    }
  }
};
</script>


<style scoped>
.Mongolia {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
}
.content {
  width: 1400px;
  max-height: 880px;
  background-color: #fff;
  margin: 30px auto;
  border-radius: 10px;
  overflow: hidden;
  /* overflow-x: hidden; */
  overflow-y: scroll; 
} 
.logistics {
  width: 1000px;
  background-color: #fff;
  margin: 150px auto;
  position: relative;
  border-radius: 8px;
}

/* 去掉滚动条   */
  /* .content::-webkit-scrollbar {
  display: none;
} */
.content .close {
  color: #FFA800;
  font-size: 30px;
  float: right;
  position: sticky;
  top: 10px;
  right: 60px;
  z-index: 999;
  cursor: pointer;
  width: 0;
  height: 0;
}
.logistics .close {
  color: #FFA800;
  font-size: 30px;
  position: absolute;
  top: 20px;
  right: 30px;
  z-index: 999;
  cursor: pointer;
}
</style>