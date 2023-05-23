<template>
  <!-- <canvas id="test" ref="test">
  </canvas> -->
</template>
<script setup lang='ts'>
import { useThree } from '@/composables/useThree';
const test = ref<HTMLElement>()
// onMounted(() => {
//   useThree(test.value!, `
// // 创建场景
// const scene = new THREE.Scene();
// // 创建摄像机
// const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
// // 创建渲染器
// const renderer = new THREE.WebGLRenderer({ canvas: canvas });
// renderer.setSize(canvas.clientWidth, canvas.clientHeight);
// // 创建一个正方体
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
// // 调整摄像机位置
// camera.position.z = 5;
// // 渲染场景
// function animate() {
// requestAnimationFrame(animate);
// cube.rotation.x += 0.01;
// cube.rotation.y += 0.01;
// renderer.render(scene, camera);
// }
// animate();`)
// })
</script>
<style lang="scss">
.test {
  width: 100%;
  height: 100%;
  background: #FFF;
  z-index: 9999;
}

// canvas {
//   width: 10% !important;
//   height: 10% !important;
//   position: absolute;
//   top: 0;
//   left: 0;
//   z-index: 9999;
// }
</style>