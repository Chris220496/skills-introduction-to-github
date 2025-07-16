import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GameState, InventoryItem, Quest, Skill } from '../../types/GameTypes';
import { mockData } from '../../data/mockData';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GameUIProps {
  gameState: GameState;
  onGameStateChange: (newState: Partial<GameState>) => void;
  isVisible: boolean;
}

const GameUI: React.FC<GameUIProps> = ({ gameState, onGameStateChange, isVisible }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'quests' | 'skills' | 'map'>('inventory');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  if (!isVisible) return null;

  const renderTabButton = (
    tab: 'inventory' | 'quests' | 'skills' | 'map',
    icon: string,
    label: string
  ) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderInventoryTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.inventoryContainer}>
        <ScrollView style={styles.itemsList}>
          <View style={styles.itemsGrid}>
            {mockData.inventory.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.inventoryItem,
                  selectedItem?.id === item.id && styles.selectedItem,
                ]}
                onPress={() => setSelectedItem(item)}
              >
                <Text style={styles.itemIcon}>{item.icon}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.itemDetails}>
          {selectedItem ? (
            <View>
              <Text style={styles.itemDetailName}>{selectedItem.name}</Text>
              <Text style={styles.itemDetailDescription}>
                {selectedItem.description}
              </Text>
              <View style={styles.itemDetailStats}>
                <View style={styles.statBadge}>
                  <Text style={styles.statText}>Tipo: {selectedItem.type}</Text>
                </View>
                <View style={styles.statBadge}>
                  <Text style={styles.statText}>Cantidad: {selectedItem.quantity}</Text>
                </View>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity style={styles.useButton}>
                  <Text style={styles.buttonText}>Usar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.discardButton}>
                  <Text style={styles.buttonText}>Descartar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.noSelection}>
              Selecciona un objeto para ver sus detalles
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderQuestsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.questsContainer}>
        <ScrollView style={styles.questsList}>
          {mockData.quests.filter(q => q.status === 'active').map((quest, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.questItem,
                selectedQuest?.id === quest.id && styles.selectedQuest,
              ]}
              onPress={() => setSelectedQuest(quest)}
            >
              <Text style={styles.questIcon}>{quest.icon}</Text>
              <View style={styles.questInfo}>
                <Text style={styles.questTitle}>{quest.title}</Text>
                <Text style={styles.questGiver}>{quest.giver}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(quest.progress / quest.maxProgress) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.questDetails}>
          {selectedQuest ? (
            <View>
              <View style={styles.questHeader}>
                <Text style={styles.questDetailIcon}>{selectedQuest.icon}</Text>
                <Text style={styles.questDetailTitle}>{selectedQuest.title}</Text>
              </View>
              <Text style={styles.questDetailDescription}>
                {selectedQuest.description}
              </Text>
              <View style={styles.questDetailStats}>
                <View style={styles.statBadge}>
                  <Text style={styles.statText}>Tipo: {selectedQuest.type}</Text>
                </View>
                <View style={styles.statBadge}>
                  <Text style={styles.statText}>
                    Progreso: {selectedQuest.progress}/{selectedQuest.maxProgress}
                  </Text>
                </View>
              </View>
              <View style={styles.questRewards}>
                <Text style={styles.rewardsTitle}>Recompensas:</Text>
                <Text style={styles.rewardText}>• {selectedQuest.rewards.exp} EXP</Text>
                <Text style={styles.rewardText}>• {selectedQuest.rewards.gold} Monedas</Text>
                {selectedQuest.rewards.items.map((item, idx) => (
                  <Text key={idx} style={styles.rewardText}>• {item}</Text>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.noSelection}>
              Selecciona una misión para ver sus detalles
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderSkillsTab = () => (
    <View style={styles.tabContent}>
      <ScrollView style={styles.skillsList}>
        {mockData.skills.map((skill, index) => (
          <View key={index} style={styles.skillItem}>
            <Text style={styles.skillIcon}>{skill.icon}</Text>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <Text style={styles.skillDescription}>{skill.description}</Text>
              <View style={styles.skillProgress}>
                <Text style={styles.skillLevel}>Nivel {skill.level}</Text>
                <Text style={styles.skillExp}>{skill.exp}/{skill.maxExp} EXP</Text>
              </View>
              <View style={styles.skillBar}>
                <View
                  style={[
                    styles.skillFill,
                    { width: `${(skill.exp / skill.maxExp) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderMapTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Mapa del Mundo</Text>
        <View style={styles.mapGrid}>
          {[
            { icon: '🌲', name: 'Bosque Encantado', color: '#2d5016' },
            { icon: '🏰', name: 'Castillo Real', color: '#4169e1' },
            { icon: '⛰️', name: 'Montañas Místicas', color: '#708090' },
            { icon: '🏘️', name: 'Aldea Inicial', color: '#8b7355' },
            { icon: '🔮', name: 'Torre del Mago', color: '#4b0082' },
            { icon: '🏴‍☠️', name: 'Cueva del Dragón', color: '#8b0000' },
          ].map((location, index) => (
            <View key={index} style={[styles.mapLocation, { backgroundColor: location.color }]}>
              <Text style={styles.mapLocationIcon}>{location.icon}</Text>
              <Text style={styles.mapLocationName}>{location.name}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.mapInstructions}>
          Usa el joystick para explorar el mundo
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => onGameStateChange({ showUI: false })}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#2c3e50', '#34495e']}
            style={styles.modalGradient}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>🦊 Aventura del Zorro Medieval</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => onGameStateChange({ showUI: false })}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
              {renderTabButton('inventory', '🎒', 'Inventario')}
              {renderTabButton('quests', '⚔️', 'Misiones')}
              {renderTabButton('skills', '🌟', 'Habilidades')}
              {renderTabButton('map', '🗺️', 'Mapa')}
            </View>

            <View style={styles.content}>
              {activeTab === 'inventory' && renderInventoryTab()}
              {activeTab === 'quests' && renderQuestsTab()}
              {activeTab === 'skills' && renderSkillsTab()}
              {activeTab === 'map' && renderMapTab()}
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.8,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 10,
  },
  modalGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f39c12',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f39c12',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#34495e',
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#f39c12',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  tabLabel: {
    fontSize: 12,
    color: '#ecf0f1',
  },
  activeTabLabel: {
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  inventoryContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
  },
  itemsList: {
    flex: 1,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  inventoryItem: {
    width: 80,
    height: 80,
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#34495e',
  },
  selectedItem: {
    borderColor: '#f39c12',
    backgroundColor: '#3e2723',
  },
  itemIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  itemName: {
    fontSize: 8,
    color: '#ecf0f1',
    textAlign: 'center',
  },
  itemQuantity: {
    fontSize: 8,
    color: '#95a5a6',
  },
  itemDetails: {
    flex: 1,
    backgroundColor: '#34495e',
    borderRadius: 10,
    padding: 15,
  },
  itemDetailName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 10,
  },
  itemDetailDescription: {
    fontSize: 14,
    color: '#ecf0f1',
    marginBottom: 15,
  },
  itemDetailStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 15,
  },
  statBadge: {
    backgroundColor: '#2c3e50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statText: {
    fontSize: 12,
    color: '#ecf0f1',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 10,
  },
  useButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  discardButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noSelection: {
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 50,
  },
  questsContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
  },
  questsList: {
    flex: 1,
  },
  questItem: {
    flexDirection: 'row',
    backgroundColor: '#34495e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#2c3e50',
  },
  selectedQuest: {
    borderColor: '#f39c12',
    backgroundColor: '#3e2723',
  },
  questIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 5,
  },
  questGiver: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#2c3e50',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
  },
  questDetails: {
    flex: 1,
    backgroundColor: '#34495e',
    borderRadius: 10,
    padding: 15,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  questDetailIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  questDetailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f39c12',
  },
  questDetailDescription: {
    fontSize: 14,
    color: '#ecf0f1',
    marginBottom: 15,
  },
  questDetailStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 15,
  },
  questRewards: {
    marginTop: 10,
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 5,
  },
  rewardText: {
    fontSize: 12,
    color: '#ecf0f1',
    marginBottom: 2,
  },
  skillsList: {
    flex: 1,
  },
  skillItem: {
    flexDirection: 'row',
    backgroundColor: '#34495e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  skillIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 5,
  },
  skillDescription: {
    fontSize: 12,
    color: '#ecf0f1',
    marginBottom: 10,
  },
  skillProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  skillLevel: {
    fontSize: 12,
    color: '#ecf0f1',
  },
  skillExp: {
    fontSize: 12,
    color: '#95a5a6',
  },
  skillBar: {
    height: 6,
    backgroundColor: '#2c3e50',
    borderRadius: 3,
    overflow: 'hidden',
  },
  skillFill: {
    height: '100%',
    backgroundColor: '#f39c12',
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 20,
  },
  mapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
    marginBottom: 20,
  },
  mapLocation: {
    width: 100,
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  mapLocationIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  mapLocationName: {
    fontSize: 10,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  mapInstructions: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
  },
});

export default GameUI;