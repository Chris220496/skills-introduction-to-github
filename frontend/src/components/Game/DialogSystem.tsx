import React, { useState, useEffect } from 'react';
import { NPC } from '../../types/GameTypes';
import { mockData } from '../../data/mockData';

interface DialogSystemProps {
  isVisible: boolean;
  npc: NPC | null;
  onClose: () => void;
  onQuestAccept: (questId: number) => void;
}

const DialogSystem: React.FC<DialogSystemProps> = ({
  isVisible,
  npc,
  onClose,
  onQuestAccept,
}) => {
  const [currentDialog, setCurrentDialog] = useState<any>(null);
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

  if (!isVisible || !currentDialog || !npc) return null;

  const currentMessage = currentDialog.messages[currentDialogIndex];
  const isLastMessage = currentDialogIndex === currentDialog.messages.length - 1;

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 1000
    },
    dialog: {
      width: '90%',
      maxWidth: '600px',
      backgroundColor: '#2c3e50',
      borderRadius: '15px 15px 0 0',
      border: '2px solid #f39c12',
      padding: '20px',
      margin: '20px',
      boxShadow: '0 -5px 20px rgba(0, 0, 0, 0.5)'
    },
    npcHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
      gap: '15px'
    },
    npcIcon: {
      fontSize: '48px',
      backgroundColor: '#f39c12',
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    npcName: {
      fontSize: '20px',
      color: '#f39c12',
      fontWeight: 'bold'
    },
    npcType: {
      fontSize: '14px',
      color: '#95a5a6',
      textTransform: 'capitalize' as const
    },
    messageContainer: {
      backgroundColor: '#34495e',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px',
      minHeight: '80px'
    },
    messageText: {
      fontSize: '16px',
      color: '#ecf0f1',
      lineHeight: '1.6'
    },
    progressIndicator: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px'
    },
    progressDots: {
      display: 'flex',
      gap: '8px'
    },
    progressDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#7f8c8d'
    },
    activeDot: {
      backgroundColor: '#f39c12'
    },
    progressText: {
      fontSize: '12px',
      color: '#95a5a6'
    },
    buttons: {
      display: 'flex',
      gap: '10px'
    },
    button: {
      padding: '12px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'all 0.2s'
    },
    nextButton: {
      backgroundColor: '#3498db',
      color: 'white',
      flex: 1
    },
    questButton: {
      backgroundColor: '#27ae60',
      color: 'white',
      flex: 1
    },
    cancelButton: {
      backgroundColor: '#95a5a6',
      color: 'white',
      flex: 1
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <div style={styles.npcHeader}>
          <div style={styles.npcIcon}>
            {npc.icon}
          </div>
          <div>
            <div style={styles.npcName}>{npc.name}</div>
            <div style={styles.npcType}>{npc.type}</div>
          </div>
        </div>

        <div style={styles.messageContainer}>
          <div style={styles.messageText}>{currentMessage.text}</div>
        </div>

        <div style={styles.progressIndicator}>
          <div style={styles.progressDots}>
            {currentDialog.messages.map((_: any, index: number) => (
              <div
                key={index}
                style={{
                  ...styles.progressDot,
                  ...(index === currentDialogIndex ? styles.activeDot : {})
                }}
              />
            ))}
          </div>
          <div style={styles.progressText}>
            {currentDialogIndex + 1} / {currentDialog.messages.length}
          </div>
        </div>

        <div style={styles.buttons}>
          <button
            style={{ ...styles.button, ...styles.nextButton }}
            onClick={handleNext}
          >
            {isLastMessage ? '✓ Cerrar' : '→ Siguiente'}
          </button>

          {currentDialog.questId && isLastMessage && (
            <button
              style={{ ...styles.button, ...styles.questButton }}
              onClick={handleQuestAccept}
            >
              ⚔️ Aceptar Misión
            </button>
          )}

          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onClose}
          >
            ✕ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogSystem;