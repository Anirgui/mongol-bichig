<script setup>
import {
  ref,
  onMounted,
  nextTick
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

const route = useRoute()
const router = useRouter()

const title = ref('')
const author = ref('')
const category = ref('')
const content = ref('')

const editor = ref(null)

const loading = ref(true)
const saving = ref(false)

async function loadArticle() {
  loading.value = true

  try {
    const response = await fetch(
      'https://mongol-bichig.vercel.app/api/articles',
      {
        cache: 'no-store'
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message || 'Нийтлэл авахад алдаа гарлаа'
      )
    }

    const articles = Array.isArray(data.articles)
      ? data.articles
      : []

    const id = String(route.params.id)

    const article = articles.find(
      item => String(item.id) === id
    )

    if (!article) {
      alert('Нийтлэл олдсонгүй')
      router.push('/admin')
      return
    }

    title.value = article.title || ''
    author.value = article.author || ''
    category.value = article.category || ''
    content.value = article.content || ''

    await nextTick()

    if (editor.value) {
      editor.value.textContent =
        article.content || ''
    }

  } catch (error) {
    console.error(
      'Нийтлэл авах алдаа:',
      error
    )

    alert(
      'Нийтлэл авахад алдаа гарлаа: ' +
      error.message
    )

    router.push('/admin')

  } finally {
    loading.value = false
  }
}

function updateContent() {
  if (!editor.value) {
    return
  }

  content.value =
    editor.value.innerText
}

async function saveArticle() {
  updateContent()

  if (!title.value.trim()) {
    alert('Гарчиг оруулна уу!')
    return
  }

  if (!content.value.trim()) {
    alert('Монгол бичгийн текст хоосон байна!')
    return
  }

  saving.value = true

  const article = {
    id: String(route.params.id),

    title: title.value.trim(),

    author:
      author.value.trim() ||
      'Тодорхойгүй',

    category: category.value,

    content: content.value,

    status: 'published'
  }

  try {
    const response = await fetch(
      'https://mongol-bichig.vercel.app/api/articles',
      {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(article)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message ||
        'Нийтлэл хадгалахад алдаа гарлаа'
      )
    }

    console.log(
      'PUT API хариу:',
      data
    )

    alert(
      'Нийтлэл амжилттай засагдлаа! 🎉'
    )

    router.push('/admin')

  } catch (error) {
    console.error(
      'Нийтлэл хадгалах алдаа:',
      error
    )

    alert(
      'Алдаа: ' +
      error.message
    )

  } finally {
    saving.value = false
  }
}

function cancel() {
  router.push('/admin')
}

onMounted(() => {
  loadArticle()
})
</script>


<template>

  <div class="edit-page">

    <!-- Ачаалж байгаа -->

    <div
      v-if="loading"
      class="loading"
    >
      Нийтлэлийг ачаалж байна...
    </div>


    <!-- Засах хэсэг -->

    <template v-else>

      <div class="topbar">

        <h1>
          Нийтлэл засах
        </h1>

        <div class="actions">

          <button
            class="cancel-button"
            @click="cancel"
            :disabled="saving"
          >
            Болих
          </button>

          <button
            class="save-button"
            @click="saveArticle"
            :disabled="saving"
          >
            {{ saving ? 'Хадгалж байна...' : 'Хадгалах' }}
          </button>

        </div>

      </div>


      <div class="form">

        <!-- Гарчиг -->

        <input
          v-model="title"
          class="title-input"
          type="text"
          placeholder="Гарчиг"
        />


        <!-- Зохиогч + ангилал -->

        <div class="row">

          <input
            v-model="author"
            type="text"
            placeholder="Зохиогч"
          />

          <select v-model="category">

            <option value="">
              Ангилал сонгох
            </option>

            <option value="Шүлэг">
              Шүлэг
            </option>

            <option value="Өгүүллэг">
              Өгүүллэг
            </option>

            <option value="Зүйр цэцэн үг">
              Зүйр цэцэн үг
            </option>

            <option value="Үлгэр">
              Үлгэр
            </option>

            <option value="Бусад">
              Бусад
            </option>

          </select>

        </div>


        <!-- Монгол бичгийн editor -->

        <div
          ref="editor"
          class="mongol-editor"
          contenteditable="true"
          data-placeholder="Монгол бичгийн текстээ энд оруулна уу..."
          @input="updateContent"
        ></div>

      </div>

    </template>

  </div>

</template>


<style scoped>

@font-face {
  font-family: MongolianScript;
  src: url('/fonts/MongolianScript.ttf');
}


.edit-page {
  min-height: 100vh;

  background: #f5f5f5;

  padding: 25px;

  box-sizing: border-box;
}


/* LOADING */

.loading {
  text-align: center;

  padding: 100px 20px;

  color: #666;

  font-size: 18px;
}


/* TOPBAR */

.topbar {
  max-width: 1000px;

  margin: 0 auto 20px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 15px;
}

.topbar h1 {
  margin: 0;
}


/* ACTIONS */

.actions {
  display: flex;

  gap: 8px;
}

.actions button {
  padding: 9px 15px;

  border-radius: 6px;

  cursor: pointer;

  font-size: 14px;
}

.actions button:disabled {
  opacity: .6;

  cursor: default;
}

.cancel-button {
  border: 1px solid #ddd;

  background: white;

  color: #333;
}

.save-button {
  border: none;

  background: #222;

  color: white;
}


/* FORM */

.form {
  max-width: 1000px;

  margin: 0 auto;
}


/* TITLE */

.title-input {
  width: 100%;

  box-sizing: border-box;

  padding: 13px;

  margin-bottom: 12px;

  border: 1px solid #ddd;

  border-radius: 7px;

  font-size: 20px;

  background: white;
}


/* ROW */

.row {
  display: flex;

  gap: 10px;

  margin-bottom: 15px;
}

.row input,
.row select {
  flex: 1;

  padding: 11px;

  border: 1px solid #ddd;

  border-radius: 7px;

  background: white;

  font-size: 15px;
}


/* MONGOLIAN EDITOR */

.mongol-editor {

  writing-mode: vertical-lr;

  direction: rtl;

  text-orientation: mixed;


  font-family: MongolianScript, serif;

  font-size: 18px;

  line-height: 1.7;


  min-height: 700px;

  width: 100%;


  white-space: pre-wrap;


  text-align: left;


  outline: none;


  padding: 25px;


  background: white;

  border: 1px solid #ddd;

  border-radius: 8px;


  overflow-x: auto;

  overflow-y: hidden;


  box-sizing: border-box;
}


/* PLACEHOLDER */

.mongol-editor:empty::before {

  content: attr(data-placeholder);

  color: #aaa;

  pointer-events: none;
}


/* MOBILE */

@media (max-width: 600px) {

  .edit-page {
    padding: 15px;
  }

  .topbar {

    align-items: flex-start;

    flex-direction: column;
  }

  .actions {

    width: 100%;
  }

  .actions button {

    flex: 1;
  }

  .row {

    flex-direction: column;
  }

}

</style>