import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { registrationSchema, type RegistrationFormData } from "@/lib/form-schema"

interface RegistrationFormProps {
  eventId?: string
}

export function RegistrationForm({ eventId }: RegistrationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  })

  const attending = watch("attending")

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true)
    try {
      const payload = eventId ? { ...data, eventId } : data
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setIsSubmitted(true)
        confetti()
        toast.success("Registration successful!")
      } else {
        const error = await response.json()
        toast.error((error as any).error || "Registration failed")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto glassmorphism rounded-3xl">
        <CardHeader>
          <CardTitle className="font-display">Thank You!</CardTitle>
          <CardDescription>
            Your registration has been submitted successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            We look forward to seeing you at the event!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto glassmorphism rounded-3xl">
      <CardHeader>
        <CardTitle className="font-display">Event Registration</CardTitle>
        <CardDescription>
          Please fill out the form below to register for the event.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="attending">Will you be attending? *</Label>
            <Select
              value={attending}
              onValueChange={(value) => setValue("attending", value as "Yes" | "No")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select attendance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
            {errors.attending && (
              <p className="text-sm text-destructive">{errors.attending.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-start gap-2">
              <input
                id="termsAccepted"
                type="checkbox"
                {...register("termsAccepted")}
                className="mt-1"
              />
              <label htmlFor="termsAccepted" className="text-sm text-muted-foreground leading-relaxed">
                I agree to provide my details for this event registration. My information will only be used for event communication if I provide email/phone, and will not be sold or shared.
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-sm text-destructive mt-1">{errors.termsAccepted.message}</p>
            )}
          </div>

          <Button type="submit" variant="gradient" className="w-full hover:scale-105 transition-transform" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}