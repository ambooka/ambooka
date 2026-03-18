'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { cn } from '@/lib/utils'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'

const MAX_MESSAGE_LENGTH = 500

const contactSchema = z.object({
  fullname: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(MAX_MESSAGE_LENGTH, `Message must be at most ${MAX_MESSAGE_LENGTH} characters`),
})

type ContactFormData = z.infer<typeof contactSchema>

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [submitStatus, setSubmitStatus] = React.useState<SubmitStatus>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: { fullname: '', email: '', message: '' },
  })

  const messageValue = watch('message')

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('loading')
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: data.fullname,
        email: data.email,
        message: data.message,
      })
      if (error) throw error
      setSubmitStatus('success')
      reset()
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="relative flex flex-col gap-1.5">
          <label htmlFor="fullname" className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Full Name
          </label>
          <Input
            id="fullname"
            type="text"
            placeholder="John Doe"
            {...register('fullname')}
            className={cn(
              "h-12 border-[hsl(var(--border))] bg-[hsl(var(--background))]/50 font-medium",
              touchedFields.fullname && errors.fullname && "border-red-500 focus-visible:ring-red-500",
              touchedFields.fullname && !errors.fullname && "border-green-500 focus-visible:ring-green-500"
            )}
          />
          {touchedFields.fullname && (
            <div className="absolute right-3 top-[34px] pointer-events-none">
              {errors.fullname ? <AlertCircle className="w-5 h-5 text-red-500" /> : <CheckCircle2 className="w-5 h-5 text-green-500" />}
            </div>
          )}
          {touchedFields.fullname && errors.fullname && (
            <p role="alert" className="text-red-500 text-xs flex items-center gap-1.5 font-medium mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.fullname.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="relative flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            className={cn(
              "h-12 border-[hsl(var(--border))] bg-[hsl(var(--background))]/50 font-medium",
              touchedFields.email && errors.email && "border-red-500 focus-visible:ring-red-500",
              touchedFields.email && !errors.email && "border-green-500 focus-visible:ring-green-500"
            )}
          />
          {touchedFields.email && (
            <div className="absolute right-3 top-[34px] pointer-events-none">
              {errors.email ? <AlertCircle className="w-5 h-5 text-red-500" /> : <CheckCircle2 className="w-5 h-5 text-green-500" />}
            </div>
          )}
          {touchedFields.email && errors.email && (
            <p role="alert" className="text-red-500 text-xs flex items-center gap-1.5 font-medium mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="relative flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Message
        </label>
        <Textarea
          id="message"
          placeholder="Your message here..."
          rows={6}
          {...register('message')}
          className={cn(
            "min-h-[120px] max-h-[300px] border-[hsl(var(--border))] bg-[hsl(var(--background))]/50 font-medium resize-y",
            touchedFields.message && errors.message && "border-red-500 focus-visible:ring-red-500",
            touchedFields.message && !errors.message && "border-green-500 focus-visible:ring-green-500"
          )}
        />
        <div className="flex justify-between items-start mt-1">
          <div>
            {touchedFields.message && errors.message && (
              <p role="alert" className="text-red-500 text-xs flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.message.message}
              </p>
            )}
          </div>
          <div className={cn("text-xs font-medium", (messageValue?.length || 0) >= MAX_MESSAGE_LENGTH ? "text-red-500" : "text-[hsl(var(--muted-foreground))]")}>
            {messageValue?.length || 0}/{MAX_MESSAGE_LENGTH}
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={!isValid || submitStatus === 'loading'}
        className={cn(
          "h-14 mt-2 w-full font-extrabold uppercase tracking-widest text-[0.75rem] gap-3 transition-all",
          "bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--secondary))] text-white hover:from-[hsl(var(--accent))] hover:to-[hsl(var(--accent))]",
          "disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_8px_20px_hsl(var(--accent)/0.2)]"
        )}
      >
        {submitStatus === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
        {submitStatus === 'success' && <CheckCircle2 className="w-5 h-5" />}
        {submitStatus === 'error' && <AlertCircle className="w-5 h-5" />}
        {submitStatus === 'idle' && <Send className="w-5 h-5" />}
        <span>
          {submitStatus === 'loading' && 'Sending...'}
          {submitStatus === 'success' && 'Message Sent!'}
          {submitStatus === 'error' && 'Failed to Send'}
          {submitStatus === 'idle' && 'Send Message'}
        </span>
      </Button>
    </form>
  )
}
