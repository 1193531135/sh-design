<template>
  <div>
    <editor id="tinymce" v-model="value" :init="init"></editor>
  </div>
</template>

<script>
import tinymce from "tinymce";
import editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver/theme";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";
import "tinymce/icons/default";
export default {
  components: { editor },
  data() {
    let config = require("./editerConfig");
    return {
      init: {
        selector: "#tinymce",
        // language_url: "./zh_CN.js",
        // language: "zh_CN",
        skin_url: "./skins/ui/oxide",
        content_css: "./skins/tinyeditor.css",
        plugins: "link lists code table wordcount image",
        font_formats: `Be Vietnam='Be Vietnam';Be Vietnam Bold;Be Vietnam BoldItalic;Be Vietnam ExtraBold;Be Vietnam ExtraBoldItalic;
        Be Vietnam Italic='Be Vietnam Italic';Be Vietnam Light;Be Vietnam LightItalic;Be Vietnam Medium;Be Vietnam MediumItalic;
        Be Vietnam SemiBold='Be Vietnam SemiBold';Be Vietnam SemiBoldItalic;Be Vietnam Thin;Be Vietnam ThinItalic;Mulish Medium;
        Gilroy ExtraBold='Gilroy ExtraBold';
        `,
        toolbar: "fontsizeselect numlist bullist lineheight",
        branding: false, // 去水印
        min_height: this.height || 500,
        paste_data_images: true,
        setup(editor) {
          editor.on("init", function() {
            this.getBody().querySelector("p").style.margin = 0;
          });
        },
        images_upload_handler: (blobInfo, success, failer) => {
          this.handleImageUpload(blobInfo, success, failer);
        },
        ...config
      }
    };
  },
  watch: {
    // value(val){
    //   this.$emit('update:textvalue',val)
    // },
  },
  computed: {
    value: {
      get() {
        return this.textvalue;
      },
      set(val) {
        this.$emit("update:textvalue", val);
      }
    }
  },
  props: ["textvalue", "height"],
  methods: {
    handleImageUpload(blobInfo, success, fail) {
      let formData = new FormData();
      // console.log(blob)
      let file = new File([blobInfo.blob()],blobInfo.filename())
      formData.append("file", file);
      console.log(file)
      console.log(formData)
      this.$request("/manage/file/upload",formData,
        res => {
          console.log('over')
          if (!res.error) {
            success(res.data.data.fileUrl);
          }else{
            fail('error')
          }
        },
        "post",
        true
      );
    }
  },
  mounted() {
    tinymce.init({});
  }
};
</script>

<style scoped>
.editor {
  width: 100%;
  height: 500px;
}
</style>