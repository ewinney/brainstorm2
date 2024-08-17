import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PresentationMode({ notes, connectors, groups, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [...notes, ...groups]; // Combine notes and groups for presentation

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <Button
        className="absolute top-4 right-4 text-white"
        onClick={onClose}
        variant="ghost"
      >
        <X />
      </Button>
      <Button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
        onClick={prevSlide}
        variant="ghost"
      >
        <ChevronLeft />
      </Button>
      <Button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
        onClick={nextSlide}
        variant="ghost"
      >
        <ChevronRight />
      </Button>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full"
        >
          {slides[currentSlide].type === 'note' ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Note</h2>
              <p>{slides[currentSlide].content}</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4">Group: {slides[currentSlide].name}</h2>
              <ul>
                {slides[currentSlide].noteIds.map((noteId) => {
                  const note = notes.find((n) => n.id === noteId);
                  return note ? <li key={noteId}>{note.content}</li> : null;
                })}
              </ul>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}