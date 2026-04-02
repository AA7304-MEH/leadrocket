import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { 
  Bold, Italic, Link as LinkIcon, List, ListOrdered, 
  Minus, User, Building2, Briefcase, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CampaignEditorProps {
  content: string;
  onChange: (html: string) => void;
  onRemix?: () => void;
  isRemixing?: boolean;
}

const tokens = [
  { label: "First Name", value: "{first_name}", icon: User },
  { label: "Company", value: "{company}", icon: Building2 },
  { label: "Role", value: "{role}", icon: Briefcase },
];

export default function CampaignEditor({ content, onChange, onRemix, isRemixing }: CampaignEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your email content here..." }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addToken = (token: string) => {
    editor.chain().focus().insertContent(token).run();
  };

  return (
    <div className="flex flex-col h-full bg-[#111111] border border-white/5 rounded-3xl overflow-hidden focus-within:border-blue-500/50 transition-all">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-white/5 bg-white/2 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            active={editor.isActive("bold")}
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            active={editor.isActive("italic")}
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => {
              const url = window.prompt("Enter URL");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }} 
            active={editor.isActive("link")}
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-white/5 mx-1" />
          
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            active={editor.isActive("bulletList")}
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            active={editor.isActive("orderedList")}
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-white/5 mx-1" />

          {/* Tokens Dropdown Placeholder Simulation */}
          <div className="flex items-center gap-2 px-2">
            {tokens.map((token) => (
              <button
                key={token.value}
                onClick={() => addToken(token.value)}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                title={`Insert ${token.label}`}
              >
                <token.icon className="w-3 h-3" />
                {token.label}
              </button>
            ))}
          </div>
        </div>

        {onRemix && (
          <Button
            size="sm"
            onClick={onRemix}
            disabled={isRemixing}
            className="h-8 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl gap-2"
          >
            <Sparkles className={cn("w-3 h-3", isRemixing && "animate-spin")} />
            {isRemixing ? "Remixing..." : "✦ Remix with AI"}
          </Button>
        )}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-8 relative min-h-[400px]">
        <EditorContent 
          editor={editor} 
          className="prose prose-invert prose-blue max-w-none focus:outline-none"
        />
      </div>
    </div>
  );
}

function ToolbarButton({ children, onClick, active }: { children: React.ReactNode, onClick: () => void, active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-xl transition-all",
        active 
          ? "bg-blue-600/20 text-blue-400" 
          : "text-slate-500 hover:text-white hover:bg-white/5"
      )}
    >
      {children}
    </button>
  );
}
