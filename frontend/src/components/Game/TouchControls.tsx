import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TouchControlsProps {
  onJoystickMove: (x: number, y: number) => void;
  onJoystickRelease: () => void;
  onActionButton: (action: 'attack' | 'interact' | 'inventory') => void;
}

const TouchControls: React.FC<TouchControlsProps> = ({
  onJoystickMove,
  onJoystickRelease,
  onActionButton,
}) => {
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);

  const joystickSize = 120;
  const knobSize = 40;
  const maxDistance = (joystickSize - knobSize) / 2;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event: GestureResponderEvent) => {
      setIsJoystickActive(true);
    },
    onPanResponderMove: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      const { dx, dy } = gestureState;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= maxDistance) {
        setJoystickPosition({ x: dx, y: dy });
        onJoystickMove(dx / maxDistance, dy / maxDistance);
      } else {
        const angle = Math.atan2(dy, dx);
        const limitedX = maxDistance * Math.cos(angle);
        const limitedY = maxDistance * Math.sin(angle);
        setJoystickPosition({ x: limitedX, y: limitedY });
        onJoystickMove(limitedX / maxDistance, limitedY / maxDistance);
      }
    },
    onPanResponderRelease: () => {
      setJoystickPosition({ x: 0, y: 0 });
      setIsJoystickActive(false);
      onJoystickRelease();
    },
  });

  return (
    <View style={styles.container}>
      {/* Virtual Joystick */}
      <View style={styles.joystickContainer}>
        <View style={[styles.joystickBase, { width: joystickSize, height: joystickSize }]}>
          <LinearGradient
            colors={['#2c3e50', '#34495e', '#2c3e50']}
            style={styles.joystickGradient}
          />
          <View
            style={[
              styles.joystickKnob,
              {
                width: knobSize,
                height: knobSize,
                transform: [
                  { translateX: joystickPosition.x },
                  { translateY: joystickPosition.y },
                ],
                backgroundColor: isJoystickActive ? '#f39c12' : '#e67e22',
              },
            ]}
            {...panResponder.panHandlers}
          >
            <LinearGradient
              colors={isJoystickActive ? ['#f39c12', '#e67e22'] : ['#e67e22', '#d35400']}
              style={styles.knobGradient}
            />
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        {/* Attack Button */}
        <TouchableOpacity
          style={[styles.actionButton, styles.attackButton]}
          onPress={() => onActionButton('attack')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#e74c3c', '#c0392b']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>⚔️</Text>
            <Text style={styles.buttonLabel}>Atacar</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Interact Button */}
        <TouchableOpacity
          style={[styles.actionButton, styles.interactButton]}
          onPress={() => onActionButton('interact')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#3498db', '#2980b9']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>🤝</Text>
            <Text style={styles.buttonLabel}>Interactuar</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Inventory Button */}
        <TouchableOpacity
          style={[styles.actionButton, styles.inventoryButton]}
          onPress={() => onActionButton('inventory')}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#9b59b6', '#8e44ad']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>🎒</Text>
            <Text style={styles.buttonLabel}>Inventario</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Movement Indicator */}
      {isJoystickActive && (
        <View style={styles.movementIndicator}>
          <Text style={styles.indicatorText}>
            {Math.abs(joystickPosition.x) > Math.abs(joystickPosition.y)
              ? joystickPosition.x > 0 ? '→' : '←'
              : joystickPosition.y > 0 ? '↓' : '↑'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  joystickContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  joystickBase: {
    borderRadius: 60,
    backgroundColor: '#34495e',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  joystickGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
  },
  joystickKnob: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  knobGradient: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 5,
  },
  buttonGradient: {
    flex: 1,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    marginBottom: 2,
  },
  buttonLabel: {
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  attackButton: {
    // Specific styles for attack button
  },
  interactButton: {
    // Specific styles for interact button
  },
  inventoryButton: {
    // Specific styles for inventory button
  },
  movementIndicator: {
    position: 'absolute',
    top: -40,
    left: screenWidth / 2 - 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  indicatorText: {
    fontSize: 20,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
});

export default TouchControls;