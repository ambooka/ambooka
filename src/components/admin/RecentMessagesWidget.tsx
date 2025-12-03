'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Mail, MoreVertical, CheckCircle, Trash2, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Message {
    id: string
    name: string
    email: string
    subject: string
    message: string
    status: 'unread' | 'read' | 'archived'
    created_at: string
}

export default function RecentMessagesWidget() {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            // @ts-ignore - Table not yet in types
            const { data, error } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5)

            if (error) {
                // If table doesn't exist yet, we might get an error. 
                // For now, we'll just log it and show empty state or mock data if preferred.
                console.error('Error fetching messages:', error)
                return
            }

            setMessages((data as any[])?.map(msg => ({
                id: msg.id,
                name: msg.name,
                email: msg.email,
                subject: msg.subject,
                message: msg.message,
                status: msg.status,
                created_at: msg.created_at
            })) || [])
        } catch (err) {
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = async (id: string) => {
        try {
            // @ts-ignore - Table not yet in types
            const { error } = await supabase
                .from('contact_messages')
                .update({ status: 'read' })
                .eq('id', id)

            if (error) throw error

            // Update local state
            setMessages(messages.map(msg =>
                msg.id === id ? { ...msg, status: 'read' } : msg
            ))
        } catch (err) {
            console.error('Error updating message:', err)
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 h-full flex flex-col shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Mail size={18} className="text-violet-600" />
                    Recent Messages
                </h3>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                    {messages.filter(m => m.status === 'unread').length} New
                </span>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse flex gap-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <Mail size={32} className="mx-auto mb-3 text-slate-300" />
                        <p>No messages yet</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`group p-3 rounded-xl border transition-all ${msg.status === 'unread'
                            ? 'bg-violet-50/50 border-violet-100'
                            : 'bg-white border-slate-100 hover:border-slate-200'
                            }`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${msg.status === 'unread' ? 'bg-violet-600' : 'bg-slate-300'}`} />
                                    <span className="font-medium text-sm text-slate-900">{msg.name}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                    <Clock size={10} />
                                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                                </span>
                            </div>

                            <h4 className="text-sm font-medium text-slate-800 mb-1">{msg.subject || 'No Subject'}</h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                                {msg.message}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100/50">
                                <span className="text-[10px] text-slate-400">{msg.email}</span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {msg.status === 'unread' && (
                                        <button
                                            onClick={() => markAsRead(msg.id)}
                                            className="p-1.5 hover:bg-violet-100 text-violet-600 rounded-lg transition-colors"
                                            title="Mark as read"
                                        >
                                            <CheckCircle size={14} />
                                        </button>
                                    )}
                                    <button className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
