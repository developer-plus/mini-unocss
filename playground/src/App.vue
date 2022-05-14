<script setup lang="ts"></script>
<template>
  <div class="w-100 h-1000 bg-red"></div>
  <div class="w-200 h-300 bg-blue"></div>
  <div class="hover:h-200 w-100 h-100 bg-red"></div>
  <div class="hover:bg-red w-100 h-100 bg-blue"></div>
</template>
<style scoped>
.w-100 {
  width: 100px;
}
.h-100 {
  height: 100px;
}
.bg-red {
  background-color: red;
}
.w-200 {
  width: 200px;
}
.h-200 {
  height: 200px;
}
.bg-blue {
  background-color: blue;
}
.hover\:h-200:hover {
  height: 200px;
}
.w-100 {
  width: 100px;
}
.h-100 {
  height: 100px;
}
.bg-red {
  background-color: red;
}
.hover\:bg-red:hover {
  background-color: red;
}
.w-100 {
  width: 100px;
}
.h-100 {
  height: 100px;
}
.bg-blue {
  background-color: blue;
}
</style>
