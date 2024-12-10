<template>
    <div>
        <video class="bg-video" src="../../../assets/bg-video.mp4" autoplay muted loop></video>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
<style scoped>
.bg-video{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>