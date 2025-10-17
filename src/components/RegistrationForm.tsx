import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { SuccessModal } from './SuccessModal';

const formSchema = z.object({
  fullName: z.string().min(2, 'Please share your full name'),
  gender: z.string().min(1, 'Please select your gender'),
  age: z.number({ invalid_type_error: 'Your age is important' }).min(1, 'Your age is important').max(120, 'Please enter a valid age'),
  phone: z.string().min(10, 'Please provide a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  location: z.string().min(2, 'Please share your location'),
  church: z.string().optional(),
  affiliation: z.string().min(1, 'Please select your affiliation'),
  photo: z.instanceof(FileList).optional(),
  howHeard: z.string().optional(),
  dramaMINISTRY: z.string().optional(),
  worshipMinister: z.string().optional(),
  expectations: z.string().optional(),
  helpNeeded: z.string().optional(),
  prayerRequests: z.string().optional(),
  confirmation: z.boolean().refine((val) => val === true, 'Please confirm to proceed'),
});

type FormData = z.infer<typeof formSchema>;

export const RegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDramaMessage, setShowDramaMessage] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const dramaMinistryValue = watch('dramaMINISTRY');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Build multipart form data so the backend can handle file + fields together
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('gender', data.gender);
      formData.append('age', String(data.age));
      formData.append('phone', data.phone);
      formData.append('email', data.email);
      formData.append('location', data.location);
      if (data.church) formData.append('church', data.church);
      formData.append('affiliation', data.affiliation);
      if (data.howHeard) formData.append('howHeard', data.howHeard);
      if (data.dramaMINISTRY) formData.append('dramaMINISTRY', data.dramaMINISTRY);
      if (data.worshipMinister) formData.append('worshipMinister', data.worshipMinister);
      if (data.expectations) formData.append('expectations', data.expectations);
      if (data.helpNeeded) formData.append('helpNeeded', data.helpNeeded);
      if (data.prayerRequests) formData.append('prayerRequests', data.prayerRequests);
      formData.append('confirmation', String(data.confirmation));
      if (data.photo && data.photo.length > 0) {
        formData.append('photo', data.photo[0]);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-registration`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Submission failed');
      }

      setShowSuccess(true);
      reset();
      setPhotoPreview(null);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: '⚠️ Submission Failed',
        description: 'Unable to send your form. Please check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setShowDramaMessage(false);
    setPhotoPreview(null);
    toast({
      title: 'Form Cleared',
      description: 'All fields have been reset.',
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto px-4 py-8 animate-fade-in relative">
        {/* Floating Home Icon */}
        <a
          href="https://oog.lovable.app/"
          className="fixed top-6 left-6 z-50 w-12 h-12 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center border border-primary/30 hover:bg-primary/30 hover:scale-110 hover:shadow-lg hover:shadow-primary/50 hover:animate-pulse-glow transition-all duration-300 group"
          aria-label="Return to Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary group-hover:text-primary-foreground transition-colors"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </a>

        <div className="glass-morphic rounded-3xl p-8 md:p-12 shadow-2xl glow-gold">
          {/* Header */}
          <div className="text-center mb-12 space-y-6 py-4">
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-foreground">
              ELOHIM'S Bible Study Retreat 2025
            </h1>
            <h2 className="font-cinzel text-5xl md:text-7xl font-black text-gradient-spiritual glow-spiritual animate-pulse-glow animate-wave py-2">
              THE NOW
            </h2>
            <p className="text-muted-foreground text-lg font-inter">
              Step into a sacred moment of spiritual transformation
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Personal Details Section */}
            <section className="space-y-6">
              <h3 className="font-cinzel text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2">
                Personal Details
              </h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    className="glass-morphic font-inter"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-destructive text-sm font-inter">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value) => setValue('gender', value)}>
                    <SelectTrigger className="glass-morphic font-inter">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-md border-primary/20">
                      <SelectItem value="Male" className="font-inter">Male</SelectItem>
                      <SelectItem value="Female" className="font-inter">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-destructive text-sm font-inter">{errors.gender.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    className="glass-morphic font-inter"
                    placeholder="Enter your age"
                  />
                  {errors.age && (
                    <p className="text-destructive text-sm font-inter">{errors.age.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone / WhatsApp Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="glass-morphic font-inter"
                    placeholder="+234 xxx xxx xxxx"
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm font-inter">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="glass-morphic font-inter"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm font-inter">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location / City *</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    className="glass-morphic font-inter"
                    placeholder="Enter your city"
                  />
                  {errors.location && (
                    <p className="text-destructive text-sm font-inter">{errors.location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="church">Church / Ministry</Label>
                  <Input
                    id="church"
                    {...register('church')}
                    className="glass-morphic font-inter"
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="affiliation">Affiliation *</Label>
                  <Select onValueChange={(value) => setValue('affiliation', value)}>
                    <SelectTrigger className="glass-morphic font-inter">
                      <SelectValue placeholder="Select affiliation" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-md border-primary/20">
                      <SelectItem value="ELOHIM'S" className="font-inter">ELOHIM'S</SelectItem>
                      <SelectItem value="RDG" className="font-inter">RDG</SelectItem>
                      <SelectItem value="Nil" className="font-inter">Nil</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.affiliation && (
                    <p className="text-destructive text-sm font-inter">{errors.affiliation.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="photo">Upload a clear passport-style photo (image file only)</Label>
                  <div className="relative">
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      {...register('photo')}
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo"
                      className="flex flex-col items-center justify-center w-full h-32 glass-morphic rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                    >
                      {photoPreview ? (
                        <img src={photoPreview} alt="Photo preview" className="h-28 w-28 object-cover rounded-lg" />
                      ) : (
                        <div className="text-center space-y-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto text-primary"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" x2="12" y1="3" y2="15" />
                          </svg>
                          <p className="text-sm text-muted-foreground font-inter">Click to upload your photo</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Spiritual Section */}
            <section className="space-y-6">
              <h3 className="font-cinzel text-2xl font-bold text-secondary border-b-2 border-secondary/30 pb-2">
                Spiritual Section
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="howHeard">How did you hear about us?</Label>
                  <Select onValueChange={(value) => setValue('howHeard', value)}>
                    <SelectTrigger className="glass-morphic font-inter">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-md border-primary/20">
                      <SelectItem value="ELOHIM'S" className="font-inter">ELOHIM'S</SelectItem>
                      <SelectItem value="RDG" className="font-inter">RDG</SelectItem>
                      <SelectItem value="FRIEND" className="font-inter">FRIEND</SelectItem>
                      <SelectItem value="CHURCH" className="font-inter">CHURCH</SelectItem>
                      <SelectItem value="STATUS" className="font-inter">STATUS</SelectItem>
                      <SelectItem value="OTHER" className="font-inter">OTHER</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dramaMINISTRY">
                    Do you wish to serve in the Drama Ministry during the retreat?
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setValue('dramaMINISTRY', value);
                      setShowDramaMessage(value === 'Yes');
                    }}
                  >
                    <SelectTrigger className="glass-morphic font-inter">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-md border-primary/20">
                      <SelectItem value="Yes" className="font-inter">Yes</SelectItem>
                      <SelectItem value="No" className="font-inter">No</SelectItem>
                      <SelectItem value="Not Sure Yet" className="font-inter">Not Sure Yet</SelectItem>
                    </SelectContent>
                  </Select>
                  {showDramaMessage && dramaMinistryValue === 'Yes' && (
                    <p className="text-accent text-sm italic animate-fade-in font-inter">
                      We're glad to have passionate vessels of expression.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="worshipMinister">Are you a Worship Minister?</Label>
                  <Select onValueChange={(value) => setValue('worshipMinister', value)}>
                    <SelectTrigger className="glass-morphic font-inter">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-md border-primary/20">
                      <SelectItem value="Yes" className="font-inter">Yes</SelectItem>
                      <SelectItem value="No" className="font-inter">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectations">
                    What are your spiritual expectations for this retreat?
                  </Label>
                  <Textarea
                    id="expectations"
                    {...register('expectations')}
                    className="glass-morphic min-h-24 font-inter"
                    placeholder="Share your spiritual expectations..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="helpNeeded">How can we help your coming?</Label>
                  <Textarea
                    id="helpNeeded"
                    {...register('helpNeeded')}
                    className="glass-morphic min-h-24 font-inter"
                    placeholder="Let us know how we can assist you..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prayerRequests">Prayer Requests</Label>
                  <Textarea
                    id="prayerRequests"
                    {...register('prayerRequests')}
                    className="glass-morphic min-h-24 font-inter"
                    placeholder="Share your prayer requests..."
                  />
                </div>
              </div>
            </section>

            {/* Confirmation Section */}
            <section className="space-y-4">
              <div className="flex items-start space-x-3 p-4 glass-morphic rounded-lg">
                <Checkbox
                  id="confirmation"
                  onCheckedChange={(checked) => setValue('confirmation', checked as boolean)}
                />
                <Label htmlFor="confirmation" className="text-sm leading-relaxed cursor-pointer font-inter">
                  By submitting, I confirm that all information provided is true and I'm prepared
                  to be part of this retreat.
                </Label>
              </div>
              {errors.confirmation && (
                <p className="text-destructive text-sm font-inter">{errors.confirmation.message}</p>
              )}
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 glow-gold font-inter"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="font-semibold text-lg px-8 py-6 rounded-xl glass-morphic hover:bg-accent/10 transition-all duration-300 font-inter"
              >
                Clear Form
              </Button>

              <Button
                type="button"
                variant="outline"
                asChild
                className="font-semibold text-lg px-8 py-6 rounded-xl glass-morphic hover:bg-secondary/10 transition-all duration-300 font-inter"
              >
                <a href="https://oog.lovable.app/">Home</a>
              </Button>
            </div>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        onRegisterAnother={() => {
          setShowSuccess(false);
          reset();
        }}
      />
    </>
  );
};
