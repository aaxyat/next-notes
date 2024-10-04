"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Search, X, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "next-themes"
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import '@/styles/quill-dark.css'
import { Navbar } from "@/components/Navbar"
import { useAuth } from "@clerk/nextjs";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <p>Loading editor...</p> })

type Note = {
  _id: string
  title?: string
  content?: string
  tags: string[]
  userId: string  // Add this line
  createdAt: string
  updatedAt: string
}

type Tag = string

export function NoteTakingAppComponent() {
  const { userId } = useAuth();
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const username = "Guest" // Placeholder username

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      if (!userId) {
        console.log('No user ID available');
        setNotes([]);
        updateTags([]);
        return;
      }
      const response = await fetch(`/api/notes?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched notes data:', data);
      if (Array.isArray(data)) {
        const sortedNotes = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotes(sortedNotes);
        updateTags(sortedNotes);
      } else {
        console.error('Fetched data is not an array:', data);
        setNotes([]);
        updateTags([]);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
      updateTags([]);
    }
  };

  const updateTags = (notesData: Note[]) => {
    const allTags = notesData.flatMap(note => note.tags);
    const uniqueTags = Array.from(new Set(allTags));
    setTags(uniqueTags);
  };

  const openNoteEditor = (note: Note) => {
    setSelectedNote(note)
    setIsEditing(true)
  }

  const openNoteCreator = () => {
    setSelectedNote({ 
      _id: '', 
      title: "", 
      content: "", 
      tags: [],
      userId: userId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Note);
    setIsCreating(true);
  }

  const closeNoteDialog = () => {
    setSelectedNote(null)
    setIsEditing(false)
    setIsCreating(false)
  }

  const saveNote = async (updatedNote: Note) => {
    try {
      if (!userId) {
        console.error('No user ID available');
        return;
      }
      if (isCreating) {
        const { _id, ...noteWithoutId } = updatedNote;
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...noteWithoutId, userId }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const savedNote = await response.json();
        console.log('Saved note:', savedNote);
        setNotes(prevNotes => [...prevNotes, savedNote]);
        updateTags([...notes, savedNote]);
      } else {
        const response = await fetch(`/api/notes/${updatedNote._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedNote),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const savedNote = await response.json();
        console.log('Updated note:', savedNote);
        setNotes(prevNotes => prevNotes.map((note) => (note._id === savedNote._id ? savedNote : note)));
      }
      closeNoteDialog();
      // Fetch notes again to ensure we have the latest data
      await fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      // You can add error handling here, such as showing an error message to the user
    }
  };

  const deleteNote = async (id: string) => {
    try {
      if (!userId) {
        console.error('No user ID available');
        return;
      }
      const response = await fetch(`/api/notes/${id}?userId=${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNotes(prevNotes => prevNotes.filter((note) => note._id !== id));
      updateTags(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      (note.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (note.content?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesTag = selectedTag ? (note.tags?.includes(selectedTag) || false) : true;
    return matchesSearch && matchesTag;
  })

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag)
  }

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (!isSearchExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 0)
    } else {
      setSearchTerm("")
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]"> {/* Adjust height to account for navbar */}
        {/* Sidebar */}
        <div className="w-64 bg-gray-200 dark:bg-gray-800 p-4">
          <h2 className="text-lg font-semibold mb-4">Tags</h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <ul>
              {tags.map((tag) => (
                <li key={tag} className="mb-2">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${selectedTag === tag ? 'bg-blue-500 text-white' : ''}`}
                    onClick={() => handleTagClick(tag)}
                  >
                    #{tag}
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex justify-end items-center mb-8">
            <div className="flex items-center space-x-4">
              {isSearchExpanded ? (
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 pr-10"
                    ref={searchInputRef}
                  />
                  <Button
                    onClick={toggleSearch}
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={toggleSearch}
                  variant="ghost"
                  size="icon"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <Search className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              )}
              <Button
                onClick={openNoteCreator}
                className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="mr-2 h-4 w-4" /> New Note
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <Card key={note._id} className="bg-white dark:bg-gray-800 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">{note.title || 'Untitled'}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div 
                    className="text-sm text-gray-600 dark:text-gray-400"
                    dangerouslySetInnerHTML={{ __html: note.content ? note.content.slice(0, 100) + '...' : 'No content' }}
                  />
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex w-full justify-between items-center mt-auto">
                    <Button
                      onClick={() => openNoteEditor(note)}
                      variant="outline"
                      size="icon"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors duration-200"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      <div>Created: {new Date(note.createdAt).toLocaleString()}</div>
                      <div>Updated: {new Date(note.updatedAt).toLocaleString()}</div>
                    </div>
                    <Button
                      onClick={() => deleteNote(note._id)}
                      variant="outline"
                      size="icon"
                      className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Note Editor/Creator Modal */}
        <Dialog open={isEditing || isCreating} onOpenChange={closeNoteDialog}>
          <DialogContent className="sm:max-w-[800px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">{isCreating ? "Create Note" : "Edit Note"}</DialogTitle>
            </DialogHeader>
            {selectedNote && (
              <div className="grid gap-8 py-4"> {/* Increased gap from 6 to 8 */}
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">Title</Label>
                  <Input
                    id="title"
                    value={selectedNote.title}
                    onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">Content</Label>
                  <div className="bg-white dark:bg-gray-800 rounded-md" style={{ minHeight: '200px' }}>
                    <ReactQuill
                      value={selectedNote.content}
                      onChange={(content) => setSelectedNote({ ...selectedNote, content })}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{'list': 'ordered'}, {'list': 'bullet'}],
                          ['link', 'image'],
                          ['clean']
                        ],
                      }}
                      className="h-full text-gray-900 dark:text-gray-100"
                      theme="snow"
                    />
                  </div>
                </div>
                <div className="grid gap-2 pt-6"> {/* Increased pt-4 to pt-6 */}
                  <Label htmlFor="tags" className="text-gray-700 dark:text-gray-300">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={selectedNote.tags.join(", ")}
                    onChange={(e) =>
                      setSelectedNote({ ...selectedNote, tags: e.target.value.split(",").map((tag) => tag.trim()) })
                    }
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-4 mt-6"> {/* Added mt-6 for top margin */}
              <Button 
                onClick={closeNoteDialog} 
                variant="outline" 
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => selectedNote && saveNote(selectedNote)} 
                className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                {isCreating ? "Create" : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}