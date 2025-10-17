import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterAnother: () => void;
}

export const SuccessModal = ({ isOpen, onClose, onRegisterAnother }: SuccessModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-morphic border-primary/30 max-w-md">
        <DialogHeader className="space-y-4">
          <div className="mx-auto">
            <CheckCircle className="w-20 h-20 text-primary animate-fade-in glow-gold" />
          </div>
          <DialogTitle className="font-cinzel text-3xl text-center text-gradient-spiritual">
            ✅ Thank You!
          </DialogTitle>
          <DialogDescription className="text-center text-lg space-y-4">
            <p className="text-foreground">
              Thank you for registering for Renewing of Minds! Your details have been received successfully.
            </p>
            <p className="font-cinzel text-xl text-primary animate-pulse-glow">
              We await you in THE NOW.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <a href="https://oog.lovable.app/">Return Home</a>
          </Button>
          <Button
            onClick={onRegisterAnother}
            variant="outline"
            className="font-semibold py-6 rounded-xl glass-morphic hover:bg-secondary/10 transition-all duration-300"
          >
            Register Another
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
