"use client"
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { MessageCircle, X, Send } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card'

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!query.trim()) return
    
    const userMsg = query
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setQuery('')
    setLoading(true)
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg })
      })
      
      const data = await res.json()
      if (data.text) {
        setMessages(prev => [...prev, { role: 'ai', text: data.text }])
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error.' }])
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error connecting to AI.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button 
            onClick={() => setIsOpen(true)} 
            className="h-14 w-14 rounded-full shadow-lg bg-[#8b0000] hover:bg-[#700000] p-0 flex items-center justify-center transition-transform hover:scale-105"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 shadow-2xl z-50 flex flex-col h-[500px] max-h-[80vh] border-slate-200">
          <CardHeader className="bg-[#8b0000] text-white rounded-t-xl flex flex-row items-center justify-between py-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageCircle className="h-4 w-4" /> Opportunity AI
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6 text-white hover:bg-[#700000]">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <div className="text-center text-sm text-slate-500 mt-10">
                <p>Hi! Ask me about opportunities.</p>
                <div className="mt-4 flex flex-col gap-2">
                  <button onClick={() => setQuery("Which hackathons are closing soon?")} className="text-xs bg-white border border-slate-200 p-2 rounded-lg hover:bg-slate-100 text-left transition-colors">"Which hackathons are closing soon?"</button>
                  <button onClick={() => setQuery("Show opportunities for first-year students")} className="text-xs bg-white border border-slate-200 p-2 rounded-lg hover:bg-slate-100 text-left transition-colors">"Show opportunities for first-year students"</button>
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-[#8b0000] text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 shadow-sm whitespace-pre-wrap rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm shadow-sm">
                  Thinking...
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-3 border-t bg-white rounded-b-lg">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex w-full gap-2"
            >
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask something..."
                className="flex-grow focus-visible:ring-[#8b0000]"
                disabled={loading}
              />
              <Button type="submit" size="icon" disabled={!query.trim() || loading} className="bg-[#8b0000] hover:bg-[#700000]">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
