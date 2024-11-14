<script setup lang="ts">
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const props = defineProps<{
  placeholder?: string;
}>();

const modelValue = defineModel<string>();

const editor = ref<Editor>();

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        blockquote: false,
        bulletList: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        listItem: false,
        orderedList: false,
        bold: false,
      }).extend({
        addKeyboardShortcuts() {
          return {
            "Cmd-b": () => this.editor.commands.toggleHeading({ level: 3 }),
            "Ctrl-b": () => this.editor.commands.toggleHeading({ level: 3 }),
          };
        },
      }),
    ],
    content: modelValue.value || props.placeholder,
    onUpdate: ({ editor: _editor }) => {
      modelValue.value = _editor.getHTML();
    },
    onFocus: ({ editor: _editor }) => {
      if (!modelValue.value && props.placeholder) {
        _editor.commands.clearContent();
      }
    },
    onBlur: ({ editor: _editor }) => {
      if (!modelValue.value && props.placeholder) {
        _editor.commands.setContent(props.placeholder);
      }
    },
    editorProps: {
      attributes: {
        class: "p-6 rounded-b-2xl",
      },
    },
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<template>
  <div
    v-if="editor"
    class="divide-y divide-label-separator rounded-2xl border border-label-separator bg-background-2"
  >
    <ul class="flex rounded-t-2xl bg-background-3">
      <li>
        <button
          class="rounded-tl-2xl border-r border-label-separator px-6 py-2 data-[active=true]:bg-background-2"
          :data-active="editor.isActive('heading', { level: 3 })"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        >
          Verse title
        </button>
      </li>
    </ul>
    <EditorContent :editor="editor" />
  </div>
</template>

<style>
.tiptap {
  line-height: 1.7;

  :first-child {
    margin-top: 0;
  }

  h3 {
    font-size: 18px;
    font-weight: 800;
    margin-top: 1em;
    margin-bottom: 0.25em;
  }
}
</style>
