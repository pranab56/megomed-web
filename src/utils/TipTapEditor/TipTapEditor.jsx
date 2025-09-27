"use client";

import { Underline } from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdFormatListBulleted } from "react-icons/md";
import { VscListOrdered } from "react-icons/vsc";
const TipTapEditor = ({
  handleJobDescription,
  handleMustHaveQualifications,
  handlePreferredQualifications,
  resetTrigger,
}) => {
  const [description, setDescription] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Add refs to track editor state and prevent unnecessary updates
  const editorInitialized = useRef(false);
  const isUpdatingContent = useRef(false);
  const lastCursorPosition = useRef({ from: 0, to: 0 });

  // Handle SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // API hook

  // Utility function to count words
  const countWords = useCallback((html) => {
    if (!html) return 0;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    const words = plainText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return words.length;
  }, []);

  // Function to truncate content to 1000 words
  const truncateTo1000Words = useCallback((html) => {
    if (!html) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    const words = plainText.trim().split(/\s+/);
    if (words.length <= 1000) return html;

    // Reconstruct HTML with only first 1000 words
    const truncatedWords = words.slice(0, 1000);
    let truncatedHtml = "";
    let wordCount = 0;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const processNode = (node) => {
      if (wordCount >= 1000) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        const wordsInText = text
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 0);

        let accumulatedText = "";
        for (const word of wordsInText) {
          if (wordCount >= 1000) break;
          accumulatedText += (accumulatedText ? " " : "") + word;
          wordCount++;
        }

        if (accumulatedText) {
          truncatedHtml += accumulatedText;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        const outerTagOpen = `<${tagName}${
          node.getAttribute("class")
            ? ` class="${node.getAttribute("class")}"`
            : ""
        }${
          node.getAttribute("style")
            ? ` style="${node.getAttribute("style")}"`
            : ""
        }>`;
        const outerTagClose = `</${tagName}>`;

        truncatedHtml += outerTagOpen;
        Array.from(node.childNodes).forEach((child) => processNode(child));
        truncatedHtml += outerTagClose;
      }
    };

    Array.from(doc.body.childNodes).forEach((child) => processNode(child));
    return truncatedHtml;
  }, []);

  // Tiptap Editor Setup with fixed cursor position handling
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          HTMLAttributes: {
            class: "list-disc pl-5",
          },
        },
        orderedList: {
          keepMarks: true,
          HTMLAttributes: {
            class: "list-decimal pl-5",
          },
        },
      }),
      Underline,
    ],
    content: description,
    immediatelyRender: false, // Prevent SSR hydration issues
    onUpdate: ({ editor }) => {
      // Prevent recursive updates
      if (isUpdatingContent.current) return;

      // Store cursor position before processing
      const { from, to } = editor.state.selection;
      lastCursorPosition.current = { from, to };

      const html = editor.getHTML();
      const words = countWords(html);

      // Only handle truncation if word count exceeds limit
      if (words > 1000) {
        isUpdatingContent.current = true;
        const truncatedHtml = truncateTo1000Words(html);

        // Use setTimeout to ensure the update happens after current cycle
        setTimeout(() => {
          editor.commands.setContent(truncatedHtml, false, {
            preserveWhitespace: "full",
          });

          // Restore cursor position (adjust for truncation)
          const newWords = countWords(truncatedHtml);
          if (newWords < words) {
            // Content was truncated, position cursor at end
            editor.commands.focus("end");
          } else {
            // Try to restore original position
            try {
              editor.commands.setTextSelection({
                from: Math.min(
                  lastCursorPosition.current.from,
                  editor.state.doc.content.size
                ),
                to: Math.min(
                  lastCursorPosition.current.to,
                  editor.state.doc.content.size
                ),
              });
            } catch (e) {
              // Fallback to focus at current position
              editor.commands.focus();
            }
          }

          isUpdatingContent.current = false;
        }, 0);

        setWordCount(1000);
        setDescription(truncatedHtml);
        console.warn(
          "Word limit of 1000 exceeded. Content has been truncated."
        );
      } else {
        // Normal update without cursor issues
        setDescription(html);
        setWordCount(words);
      }
    },
    editorProps: {
      attributes: {
        class: `focus:outline-none p-4 min-h-[240px] max-h-[240px] overflow-y-auto bg-white text-gray-800`,
      },
      handlePaste: (view, event) => {
        const html = event.clipboardData?.getData("text/html");
        const text = event.clipboardData?.getData("text/plain");

        if (html || text) {
          const currentWordCount = countWords(editor.getHTML());
          const pastedWordCount = countWords(html || text);

          if (currentWordCount + pastedWordCount > 1000) {
            event.preventDefault();
            console.warn(
              `Pasting this content would exceed the 1000 word limit. You have ${
                1000 - currentWordCount
              } words remaining.`
            );
            return true;
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        const html = event.dataTransfer?.getData("text/html");
        const text = event.dataTransfer?.getData("text/plain");

        if (html || text) {
          const currentWordCount = countWords(editor.getHTML());
          const droppedWordCount = countWords(html || text);

          if (currentWordCount + droppedWordCount > 1000) {
            event.preventDefault();
            console.warn(
              `Dropping this content would exceed the 1000 word limit. You have ${
                1000 - droppedWordCount
              } words remaining.`
            );
            return true;
          }
        }
        return false;
      },
    },
    // Add onSelectionUpdate to track cursor position
    onSelectionUpdate: ({ editor }) => {
      if (!isUpdatingContent.current) {
        const { from, to } = editor.state.selection;
        lastCursorPosition.current = { from, to };
      }
    },
  });

  // Fixed useEffect to prevent cursor jumping
  useEffect(() => {
    if (editor && editorInitialized.current && !isUpdatingContent.current) {
      // Only update if the content is actually different
      const currentContent = editor.getHTML();
      if (currentContent !== description) {
        isUpdatingContent.current = true;

        // Store current cursor position
        const { from, to } = editor.state.selection;

        editor.commands.setContent(description, false, {
          preserveWhitespace: "full",
        });

        // Restore cursor position after content update
        setTimeout(() => {
          try {
            editor.commands.setTextSelection({
              from: Math.min(from, editor.state.doc.content.size),
              to: Math.min(to, editor.state.doc.content.size),
            });
          } catch (e) {
            // Fallback: just focus the editor
            editor.commands.focus();
          }
          isUpdatingContent.current = false;
        }, 0);
      }
    } else if (editor && !editorInitialized.current) {
      // Initial setup
      editor.commands.setContent(description);
      editorInitialized.current = true;
    }
  }, [description, editor]);

  // Call the appropriate callback when description changes
  useEffect(() => {
    if (description) {
      console.log("TipTap content changed:", description);
      if (handleJobDescription) {
        console.log("Calling handleJobDescription");
        handleJobDescription(description);
      }
      if (handleMustHaveQualifications) {
        console.log("Calling handleMustHaveQualifications");
        handleMustHaveQualifications(description);
      }
      if (handlePreferredQualifications) {
        console.log("Calling handlePreferredQualifications");
        handlePreferredQualifications(description);
      }
    }
  }, [
    description,
    handleJobDescription,
    handleMustHaveQualifications,
    handlePreferredQualifications,
  ]);

  // Handle reset trigger
  useEffect(() => {
    if (resetTrigger && editor) {
      setDescription("");
      setWordCount(0);
      editor.commands.setContent("");
      editorInitialized.current = false;
    }
  }, [resetTrigger, editor]);

  // Handle dark mode change
  useEffect(() => {
    if (editor) {
      const updateClasses = () => {
        const editorWrapper = document.querySelector(".tiptap-editor-wrapper");
        if (editorWrapper) {
          editorWrapper.className = `tiptap-editor-wrapper rounded-lg border
            border-gray-300
          }`;
        }
        const content = editor.view.dom;
        content.className = `bg-white text-gray-800 p-4 min-h-[240px] max-h-[240px] overflow-y-auto focus:outline-none`;
      };
      updateClasses();
    }
  }, [editor]);

  // Auto-save draft

  // Initialize form with initial values when editing

  return (
    <>
      <style jsx global>{`
        .tiptap-editor-wrapper {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .tiptap-editor-wrapper .ProseMirror {
          padding: 0.5rem;
          outline: none;
          line-height: 1.6;
        }
        .tiptap-editor-wrapper .ProseMirror::-webkit-scrollbar {
          width: 8px;
        }
        .tiptap-editor-wrapper .ProseMirror::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .tiptap-editor-wrapper .ProseMirror::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .tiptap-editor-wrapper .ProseMirror::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .tiptap-editor-wrapper .ProseMirror {
          scrollbar-width: thin;
          scrollbar-color: #6b7280 #374151;
        }
        .word-count-indicator {
          transition: color 0.2s ease-in-out;
        }
        .word-count-warning {
          color: #f59e0b;
        }
        .word-count-error {
          color: #ef4444;
        }
      `}</style>

      <div className={`  transition-colors duration-200  text-gray-900`}>
        <div className="max-w-4xl ">
          <div
            className={`rounded-xl shadow-lg border-0 overflow-hidden ${"border-0 shadow-none"} ${"bg-white border-gray-200"}`}
          >
            <div className={`${"py-4 sm:p-6"} bg-gray-50`}>
              {/* Title Input */}

              {/* Description Editor */}
              <div className="mb-6 sm:mb-8">
                <div className="flex justify-between items-center mb-2">
                  <div
                    className={`text-sm font-medium word-count-indicator ${
                      wordCount > 900
                        ? "word-count-error"
                        : wordCount > 800
                        ? "word-count-warning"
                        : "text-gray-600"
                    }`}
                  >
                    {wordCount}/1000 words
                  </div>
                </div>
                <div
                  className="tiptap-editor-wrapper"
                  onPaste={(e) => {
                    if (e.clipboardData.files.length > 0) {
                      e.preventDefault();
                      console.warn(
                        "Image pasting is not allowed. Please use the image upload section."
                      );
                    }
                  }}
                >
                  {/* Toolbar */}
                  <div
                    className={`flex gap-1 px-1 py-2 border-b ${"bg-gray-50 border-gray-200"}`}
                  >
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`px-4 py-2 cursor-pointer rounded ${
                        editor?.isActive("bold")
                          ? "bg-blue-700 text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor?.chain().focus().toggleItalic().run()
                      }
                      className={`px-[18px] py-2 cursor-pointer rounded ${
                        editor?.isActive("italic")
                          ? "bg-blue-700 text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor?.chain().focus().toggleUnderline().run()
                      }
                      className={`px-4 py-2 cursor-pointer rounded ${
                        editor?.isActive("underline")
                          ? "bg-blue-700 text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <u>U</u>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor?.chain().focus().toggleBulletList().run()
                      }
                      className={`px-3 py-2 cursor-pointer rounded ${
                        editor?.isActive("bulletList")
                          ? "bg-blue-700 text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <MdFormatListBulleted size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        editor?.chain().focus().toggleOrderedList().run()
                      }
                      className={`px-3 py-2 cursor-pointer rounded ${
                        editor?.isActive("orderedList")
                          ? "bg-blue-700 text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <VscListOrdered size={20} />
                    </button>
                  </div>

                  {/* Editor */}
                  {mounted ? (
                    <EditorContent editor={editor} />
                  ) : (
                    <div className="min-h-[240px] p-4 bg-gray-50 animate-pulse border border-gray-200 rounded-lg" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TipTapEditor;
