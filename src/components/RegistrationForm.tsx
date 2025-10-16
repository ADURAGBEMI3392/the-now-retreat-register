import { useState } from 'react';
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
  fullName: z.string().min(2, 'Full name is required'),
  gender: z.string().min(1, 'Gender is required'),
  age: z.number().min(1, 'Age is required').max(120, 'Please enter a valid age'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  location: z.string().min(2, 'Location is required'),
  church: z.string().optional(),
  affiliation: z.string().min(1, 'Affiliation is required'),
  howHeard: z.string().optional(),
  dramaMINISTRY: z.string().optional(),
  worshipMinister: z.string().optional(),
  expectations: z.string().optional(),
  helpNeeded: z.string().optional(),
  prayerRequests: z.string().optional(),
  confirmation: z.boolean().refine((val) => val === true, 'You must confirm to proceed'),
});

type FormData = z.infer<typeof formSchema>;

export const RegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDramaMessage, setShowDramaMessage] = useState(false);
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
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbxT53CQYEscL2PIP550vlKfbhNhWykCsMnFr44TIDPncRYexv_LvmHSReB5eo4fjzrMDA/exec',
        {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      setShowSuccess(true);
      reset();
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission Error',
        description: 'There was an issue submitting your registration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setShowDramaMessage(false);
    toast({
      title: 'Form Cleared',
      description: 'All fields have been reset.',
    });
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <div className="glass-morphic rounded-3xl p-8 md:p-12 shadow-2xl glow-gold">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-foreground">
              ELOHIM'S Bible Study Retreat 2025
            </h1>
            <h2 className="font-cinzel text-5xl md:text-7xl font-black text-gradient-spiritual glow-spiritual animate-pulse-glow animate-wave">
              THE NOW
            </h2>
            <p className="text-muted-foreground text-lg">
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
                    className="glass-morphic"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-destructive text-sm">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value) => setValue('gender', value)}>
                    <SelectTrigger className="glass-morphic">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-destructive text-sm">{errors.gender.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    className="glass-morphic"
                    placeholder="Enter your age"
                  />
                  {errors.age && (
                    <p className="text-destructive text-sm">{errors.age.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone / WhatsApp Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="glass-morphic"
                    placeholder="+234 xxx xxx xxxx"
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="glass-morphic"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location / City *</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    className="glass-morphic"
                    placeholder="Enter your city"
                  />
                  {errors.location && (
                    <p className="text-destructive text-sm">{errors.location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="church">Church / Ministry</Label>
                  <Input
                    id="church"
                    {...register('church')}
                    className="glass-morphic"
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="affiliation">Affiliation *</Label>
                  <Select onValueChange={(value) => setValue('affiliation', value)}>
                    <SelectTrigger className="glass-morphic">
                      <SelectValue placeholder="Select affiliation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ELOHIM'S">ELOHIM'S</SelectItem>
                      <SelectItem value="RDG">RDG</SelectItem>
                      <SelectItem value="Nil">Nil</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.affiliation && (
                    <p className="text-destructive text-sm">{errors.affiliation.message}</p>
                  )}
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
                    <SelectTrigger className="glass-morphic">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ELOHIM'S">ELOHIM'S</SelectItem>
                      <SelectItem value="RDG">RDG</SelectItem>
                      <SelectItem value="FRIEND">FRIEND</SelectItem>
                      <SelectItem value="CHURCH">CHURCH</SelectItem>
                      <SelectItem value="STATUS">STATUS</SelectItem>
                      <SelectItem value="OTHER">OTHER</SelectItem>
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
                    <SelectTrigger className="glass-morphic">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Not Sure Yet">Not Sure Yet</SelectItem>
                    </SelectContent>
                  </Select>
                  {showDramaMessage && dramaMinistryValue === 'Yes' && (
                    <p className="text-accent text-sm italic animate-fade-in">
                      We're glad to have passionate vessels of expression.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="worshipMinister">Are you a Worship Minister?</Label>
                  <Select onValueChange={(value) => setValue('worshipMinister', value)}>
                    <SelectTrigger className="glass-morphic">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
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
                    className="glass-morphic min-h-24"
                    placeholder="Share your spiritual expectations..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="helpNeeded">How can we help your coming?</Label>
                  <Textarea
                    id="helpNeeded"
                    {...register('helpNeeded')}
                    className="glass-morphic min-h-24"
                    placeholder="Let us know how we can assist you..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prayerRequests">Prayer Requests</Label>
                  <Textarea
                    id="prayerRequests"
                    {...register('prayerRequests')}
                    className="glass-morphic min-h-24"
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
                <Label htmlFor="confirmation" className="text-sm leading-relaxed cursor-pointer">
                  By submitting, I confirm that all information provided is true and I'm prepared
                  to be part of this retreat.
                </Label>
              </div>
              {errors.confirmation && (
                <p className="text-destructive text-sm">{errors.confirmation.message}</p>
              )}
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 glow-gold"
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
                className="font-semibold text-lg px-8 py-6 rounded-xl glass-morphic hover:bg-accent/10 transition-all duration-300"
              >
                Clear Form
              </Button>

              <Button
                type="button"
                variant="outline"
                asChild
                className="font-semibold text-lg px-8 py-6 rounded-xl glass-morphic hover:bg-secondary/10 transition-all duration-300"
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
