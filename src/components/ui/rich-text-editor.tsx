import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { Button } from './button'
import { Bold, Italic, List, ListOrdered, Quote } from 'lucide-react'
import { forwardRef, useImperativeHandle } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export interface RichTextEditorRef {
  focus: () => void
  getHTML: () => string
  getText: () => string
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value, onChange, placeholder = "Enter description...", className }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder,
        }),
        CharacterCount.configure({
          limit: 2000,
        }),
      ],
      content: value,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML())
      },
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] p-4 prose-p:my-4 prose-headings:my-4',
        },
      },
    })

    useImperativeHandle(ref, () => ({
      focus: () => editor?.commands.focus(),
      getHTML: () => editor?.getHTML() || '',
      getText: () => editor?.getText() || '',
    }))

    if (!editor) {
      return null
    }

    return (
      <div className={`border rounded-lg ${className}`}>
        {/* Toolbar */}
        <div className="border-b p-2 flex gap-1 flex-wrap">
          <Button
            type="button"
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="w-4 h-4" />
          </Button>
        </div>

        {/* Editor */}
        <EditorContent editor={editor} className="min-h-[120px]" />

        {/* Character Count */}
        <div className="border-t px-4 py-2 text-xs text-muted-foreground">
          {editor.storage.characterCount.characters()}/2000 characters
        </div>
      </div>
    )
  }
)

RichTextEditor.displayName = 'RichTextEditor'