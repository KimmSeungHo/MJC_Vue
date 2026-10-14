<template>
    <v-container>
        <input type="file" accept="image/*" @change="fileChange">
        <v-btn color="primary" :disabled="!preview" @click="analysis">분석</v-btn>
        <div>
            <div class="image-container">
                <canvas ref="overlay" class="canvas"></canvas>
                <img :src="preview" v-if="preview" alt="">
            </div>
        </div>
    </v-container>
</template>
<script>
import * as faceDetection from "@tensorflow-models/face-detection"
import { readImage, prepareTensorFlow, estimatePhotoFaces, drawOverlay } from "@/lib/image.js"
import { markRaw } from "vue"
export default {
    data() {
        return {
            preview: null,
            photo: null
        }
    },
    methods: {
        async analysis() {
            await prepareTensorFlow()
            var faceDetector = await faceDetection.createDetector(faceDetection.SupportedModels.MediaPipeFaceDetector, {
                runtime: "tfjs", modelType: "short", maxFaces: 5,
                detectorModelUrl: "/models/face-detector/model.json"
            })
            var faces = await estimatePhotoFaces(this.photo, faceDetector, null)
            drawOverlay(this.$refs.overlay, this.photo, faces, "face")
        },
        async fileChange(event) {
            var image = event.target.files[0]
            var preview = await readImage(image)
            this.preview = preview.toDataURL('image/png')
            this.photo = markRaw(preview)
        }
    }
}
</script>

<style scoped lang="less">
.image-container {
    position: relative;
    display: inline-block;
    max-width: 100%;
    line-height: 0;

    img {
        display: block;
        max-width: 100%;
    }

    .canvas {
        position: absolute;
        width: 100%;
        height: 100%;
        inset: 0;
    }
}

</style>