<!--
    Copyright (C) 2023 Geodätisches Institut RWTH Aachen University,
    Mies-van-der-Rohe-Straße 1, D 52074 Aachen, Germany.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
  <v-card width="100%" elevation="0" class="ma-0 pa-0" v-if="editor">
    <div class="editor">
      <ogr-editor-menu class="editor__header" :editor="editor" />
      <editor-content class="editor__content" :editor="editor" />
    </div>
    <v-card-actions class="ma-0 pa-0">
      <v-spacer />
      <span style="color: rgba(0,0,0,.6)" class="font-weight-light text-caption mr-2">{{ editor.storage.characterCount.characters() }} / {{ limit }}</span>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import OgrEditorMenu from '@/components/ogr/editor/OgrEditorMenu'

export default {
  name: 'OgrEditor',

  components: {
    OgrEditorMenu,
    EditorContent
  },

  props: {
    limit: {
      type: Number,
      required: true
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    }
  },

  data () {
    return {
      editor: null
    }
  },

  computed: {
    characters () {
      return this.editor ? this.editor.storage.characterCount.characters() : 0
    }
  },

  watch: {
    characters () {
      this.$emit('update-characters', this.characters)
    }
  },

  mounted () {
    this.editor = new Editor({
      extensions: [
        StarterKit.configure({
          history: false
        }),
        CharacterCount.configure({
          limit: this.limit
        })
      ],
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        this.$emit('input', html)
      }
    })
  },

  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>

<style lang="scss" scoped>
.editor {
  display: flex;
  flex-direction: column;
  max-height: 400px;
  color: #0D0D0D;
  background-color: white;
  border: 1px solid rgba(0,0,0,.38);
  border-radius: 4px;

  &:hover {
    border: 1px solid rgba(0,0,0,.87);
  }
  &:focus-within {
    border: 2px solid #358706;
  }

  &__header {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: 0.25rem;
    border-bottom: 1px solid rgba(0,0,0,.38);
  }

  &__content {
    padding: 10px;
    border: 0;
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  &__footer {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    white-space: nowrap;
    border-top: 1px solid #358706;
    font-size: 12px;
    font-weight: 400;
    color: #0D0D0D;
    white-space: nowrap;
    padding: 0.25rem 0.75rem;
  }

  /* Some information about the status */
  &__status {
    display: flex;
    align-items: center;
    border-radius: 5px;

    &::before {
      content: " ";
      flex: 0 0 auto;
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      background: rgba(#0D0D0D, 0.5);
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    &--connecting::before {
      background: #616161;
    }

    &--connected::before {
      background: #B9F18D;
    }
  }

  &__name {
    button {
      background: none;
      border: none;
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      color: #0D0D0D;
      border-radius: 0.4rem;
      padding: 0.25rem 0.5rem;

      &:hover {
        color: #FFF;
        background-color: #0D0D0D;
      }
    }
  }
}
</style>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: "JetBrainsMono", monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  mark {
    background-color: #FAF594;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  hr {
    margin: 1rem 0;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }

  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
      }
    }
  }
}
.ProseMirror:focus {
  outline: none;
}
</style>
