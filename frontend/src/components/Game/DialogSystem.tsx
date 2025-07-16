import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HapticFeedback from 'react-native-haptic-feedback';
import { NPC } from '../../types/GameTypes';
import { mockData } from '../../data/mockData';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(screenHeight));

  useEffect(() => {
    if (isVisible && npc) {
      const dialog = mockData.dialogs.find(d => d.npcId === npc.id);
      if (dialog) {
        setCurrentDialog(dialog);
        setCurrentDialogIndex(0);
        showDialog();
      }
    } else {
      hideDialog();
    }
  }, [isVisible, npc]);

  const showDialog = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideDialog = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    HapticFeedback.trigger('impactLight');
    
    if (currentDialogIndex < currentDialog.messages.length - 1) {
      setCurrentDialogIndex(currentDialogIndex + 1);
    } else {
      onClose();
    }
  };

  const handleQuestAccept = () => {
    HapticFeedback.trigger('notificationSuccess');
    
    if (currentDialog.questId) {
      onQuestAccept(currentDialog.questId);
    }
    onClose();
  };

  const handleCancel = () => {
    HapticFeedback.trigger('impactMedium');
    onClose();
  };

  if (!isVisible || !currentDialog || !npc) return null;

  const currentMessage = currentDialog.messages[currentDialogIndex];
  const isLastMessage = currentDialogIndex === currentDialog.messages.length - 1;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.modalOverlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.dialogContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#2c3e50', '#34495e', '#2c3e50']}
            style={styles.dialogGradient}
          >
            <View style={styles.npcHeader}>
              <View style={styles.npcAvatar}>
                <Text style={styles.npcIcon}>{npc.icon}</Text>
              </View>
              <View style={styles.npcInfo}>
                <Text style={styles.npcName}>{npc.name}</Text>
                <View style={styles.npcTypeBadge}>
                  <Text style={styles.npcType}>{npc.type}</Text>
                </View>
              </View>
            </View>

            <View style={styles.dialogContent}>
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>{currentMessage.text}</Text>
              </View>

              <View style={styles.progressIndicator}>
                <View style={styles.progressDots}>
                  {currentDialog.messages.map((_: any, index: number) => (
                    <View
                      key={index}
                      style={[
                        styles.progressDot,
                        index === currentDialogIndex && styles.activeDot,
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.progressText}>
                  {currentDialogIndex + 1} / {currentDialog.messages.length}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNext}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#3498db', '#2980b9']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>
                      {isLastMessage ? '✓ Cerrar' : '→ Siguiente'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {currentDialog.questId && isLastMessage && (
                  <TouchableOpacity
                    style={styles.questButton}
                    onPress={handleQuestAccept}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#27ae60', '#2ecc71']}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>⚔️ Aceptar Misión</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#95a5a6', '#7f8c8d']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>✕ Cancelar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  dialogContainer: {
    maxHeight: screenHeight * 0.6,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  dialogGradient: {
    flex: 1,
  },
  npcHeader: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#f39c12',
  },
  npcAvatar: {
    width: 60,
    height: 60,
    backgroundColor: '#f39c12',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  npcIcon: {
    fontSize: 28,
  },
  npcInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  npcName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 5,
  },
  npcTypeBadge: {
    backgroundColor: '#34495e',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  npcType: {
    fontSize: 12,
    color: '#ecf0f1',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dialogContent: {
    padding: 20,
  },
  messageContainer: {
    backgroundColor: '#34495e',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    minHeight: 100,
  },
  messageText: {
    fontSize: 16,
    color: '#ecf0f1',
    lineHeight: 24,
    textAlign: 'left',
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7f8c8d',
  },
  activeDot: {
    backgroundColor: '#f39c12',
  },
  progressText: {
    fontSize: 12,
    color: '#95a5a6',
  },
  actionButtons: {
    gap: 12,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  questButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default DialogSystem;