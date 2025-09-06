'use client'

import { useFormState } from 'react-dom'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Mail, MessageSquare, Send } from 'lucide-react'
import { ContactState, submitContact } from './action'
import { toast } from 'sonner'

const initialState: ContactState = { ok: false, message: '' }

export default function ContactForm() {
  const [state, formAction] = useFormState(submitContact, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.ok && formRef.current) {
      formRef.current.reset()
    }else{
      toast.error(state.message)
    }
  }, [state?.ok])

  const supportEmail = 'khulimulirabin@gmail.com'

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
          Send us a message
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4" noValidate>
          {/* Honeypot field */}
          <input
            type="text"
            name="company"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Jane Doe"
                aria-invalid={!!state?.errors?.name}
              />
              {state?.errors?.name && (
                <p className="text-sm text-destructive" role="alert">
                  {state.errors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                aria-invalid={!!state?.errors?.email}
                autoComplete="email"
              />
              {state?.errors?.email && (
                <p className="text-sm text-destructive" role="alert">
                  {state.errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="How can we help?"
              aria-invalid={!!state?.errors?.subject}
            />
            {state?.errors?.subject && (
              <p className="text-sm text-destructive" role="alert">
                {state.errors.subject}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us a bit more about what you need..."
              className="min-h-[120px]"
              aria-invalid={!!state?.errors?.message}
            />
            {state?.errors?.message && (
              <p className="text-sm text-destructive" role="alert">
                {state.errors.message}
              </p>
            )}
          </div>

          {state?.message && (
            <Alert
              variant={state.ok ? 'default' : 'destructive'}
              aria-live="polite"
              aria-atomic="true"
            >
              <AlertTitle>{state.ok ? 'Message sent' : 'There was a problem'}</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit">
              <Send className="mr-2 h-4 w-4" aria-hidden="true" />
              Send message
            </Button>
            <Button variant="outline" type="button" asChild>
              <a
                href={`mailto:${supportEmail}?subject=${encodeURIComponent(
                  'Support request'
                )}&body=${encodeURIComponent('Hi Acme team,\n\nI need help with ...\n\nThanks!')}`}
                aria-label="Email us directly"
              >
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                Email us instead
              </a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
