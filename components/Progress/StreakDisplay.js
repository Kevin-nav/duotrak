import React from 'react';
import { Flame, HelpCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

const StreakDisplay = ({ currentStreak = 0 }) => {
  // For now, streak data is passed as a prop. 
  // Later, this could come from context or a hook fetching user progress.

  return (
    <div className="relative bg-gradient-to-br from-primary-accent/90 via-primary-accent to-secondary-accent/95 p-6 rounded-xl shadow-xl flex flex-col items-center justify-center text-center min-h-[160px]">
      <div className="flex items-center justify-center mb-3">
        <Flame className="w-12 h-12 text-amber-300 animate-pulse" />
        <div className="ml-4">
          <p className="text-4xl font-bold text-primary-text-dark">{currentStreak}</p>
          <p className="text-sm uppercase tracking-wider text-primary-text-dark">Day Streak</p>
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="default"
            size="icon"
            className="absolute bottom-3 right-3 bg-white hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-accent/50 rounded-full shadow-md w-9 h-9"
            aria-label="How streaks work"
          >
            <HelpCircle className="w-5 h-5 text-slate-700" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-card-modal-background">
          <DialogHeader>
            <DialogTitle className="flex items-center text-text-primary">
              <Calendar className="w-5 h-5 mr-2 text-primary-accent"/> Daily Streaks Explained
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              Maintain your daily streak by completing at least one core system or reflection each day.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-sm text-text-secondary space-y-2">
            <p>Future enhancements could show a calendar view of your streak here!</p>
            <p>For now, remember:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Complete any system.</li>
                <li>Log a daily reflection.</li>
                <li>Consistency is key to building strong habits with your partner!</li>
            </ul>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="default" className="text-primary-foreground bg-primary-accent hover:bg-primary-accent/90">Got it!</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StreakDisplay; 