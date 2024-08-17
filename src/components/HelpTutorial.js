import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const tutorialSteps = [
  {
    title: 'Welcome to the AI-Powered Brainstorming Board',
    description: 'This tutorial will guide you through the main features of our application.',
  },
  {
    title: 'Adding Notes',
    description: 'Click the "+" button in the toolbar or use Ctrl+N to add a new note. You can drag notes around the canvas.',
  },
  {
    title: 'Creating Charts',
    description: 'Click the chart icon in the toolbar or use Ctrl+C to add a new chart. You can customize the chart data.',
  },
  {
    title: 'Connecting Ideas',
    description: 'Use the arrow icon in the toolbar to create connectors between notes and charts.',
  },
  {
    title: 'Grouping Items',
    description: 'Click the folder icon to create a new group. Drag notes and charts into the group to organize your ideas.',
  },
  {
    title: 'AI Suggestions',
    description: 'Use the AI suggestions panel on the right to get creative ideas based on your current notes.',
  },
  {
    title: 'Exporting Your Work',
    description: 'Use the export buttons at the top right to save your board as a JSON file or an image.',
  },
  {
    title: 'Keyboard Shortcuts',
    description: 'Ctrl+Z: Undo, Ctrl+Y: Redo, Ctrl+S: Export, Ctrl+F: Search',
  },
];

export default function HelpTutorial({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tutorialSteps[currentStep].title}</DialogTitle>
          <DialogDescription>
            {tutorialSteps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between mt-4">
          <Button onClick={prevStep} disabled={currentStep === 0}>
            Previous
          </Button>
          <Button onClick={nextStep}>
            {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}