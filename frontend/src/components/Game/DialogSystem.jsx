import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { mockData } from '../../data/mockData';

const DialogSystem = ({ isVisible, npc, onClose, onQuestAccept }) => {
  const [currentDialog, setCurrentDialog] = useState(null);
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);

  useEffect(() => {
    if (isVisible && npc) {
      const dialog = mockData.dialogs.find(d => d.npcId === npc.id);
      if (dialog) {
        setCurrentDialog(dialog);
        setCurrentDialogIndex(0);
      }
    }
  }, [isVisible, npc]);

  if (!isVisible || !currentDialog) return null;

  const handleNext = () => {
    if (currentDialogIndex < currentDialog.messages.length - 1) {
      setCurrentDialogIndex(currentDialogIndex + 1);
    } else {
      onClose();
    }
  };

  const handleQuestAccept = () => {
    if (currentDialog.questId) {
      onQuestAccept(currentDialog.questId);
    }
    onClose();
  };

  const currentMessage = currentDialog.messages[currentDialogIndex];
  const isLastMessage = currentDialogIndex === currentDialog.messages.length - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 mb-4 bg-gray-900 text-white border-amber-600">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{npc.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-400 mb-2">{npc.name}</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                {currentMessage.text}
              </p>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLastMessage ? 'Cerrar' : 'Siguiente'}
                </Button>
                
                {currentDialog.questId && isLastMessage && (
                  <Button
                    onClick={handleQuestAccept}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Aceptar Misión
                  </Button>
                )}
                
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            {currentDialogIndex + 1} / {currentDialog.messages.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DialogSystem;