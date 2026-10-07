<template>
  <v-container>
    <v-text-field v-model="Url" placeholder="뉴스 URL을 넣어주세요"></v-text-field>
    <div class="text-center">
        <v-btn color="primary" @click="submit">요약</v-btn>
    </div>
    <div class="summary">
        {{ summary }}
    </div>
  </v-container>
</template>

<script>
    export default {
        data() {
            return {
                Url: "",
                summary: "요약된 뉴스내용 여기에 표시됩니다."
            }
        },
        methods: {
            async submit() {
                var result = await this.$axios.post("/news/summary", { 
                    url: this.Url 
                })
                if(result.data.success) {     // 요약된 뉴스내용 성공적으로 가져왔을 경우
                    this.summary = result.data.summary
                } else {
                    this.summary = "뉴스 요약에 실패했습니다."
                }
            }
        }
    }
</script>

<style>
    .summary {
        margin-top: 20px;
        font-size: 20px;
        background: #f5f5f5;
        padding: 20px;
    }
</style>
