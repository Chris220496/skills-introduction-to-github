import React, { useState } from 'react';
import { GameState, InventoryItem, Quest, Skill } from '../../types/GameTypes';
import { mockData } from '../../data/mockData';

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

  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      width: '90%',
      maxWidth: '800px',
      height: '80%',
      backgroundColor: '#2c3e50',
      borderRadius: '15px',
      border: '2px solid #f39c12',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column' as const
    },
    header: {
      padding: '20px',
      backgroundColor: '#34495e',
      borderBottom: '2px solid #f39c12',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '24px',
      color: '#f39c12',
      fontWeight: 'bold'
    },
    closeButton: {
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold'
    },
    tabs: {
      display: 'flex',
      backgroundColor: '#34495e',
      borderBottom: '1px solid #555'
    },
    tab: {
      flex: 1,
      padding: '15px',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ecf0f1',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    activeTab: {
      backgroundColor: '#f39c12',
      color: '#2c3e50'
    },
    content: {
      flex: 1,
      padding: '20px',
      overflow: 'auto'
    },
    inventoryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
      gap: '10px',
      marginBottom: '20px'
    },
    inventoryItem: {
      padding: '10px',
      backgroundColor: '#34495e',
      borderRadius: '8px',
      border: '2px solid #555',
      cursor: 'pointer',
      textAlign: 'center' as const,
      transition: 'all 0.2s'
    },
    selectedItem: {
      borderColor: '#f39c12',
      backgroundColor: '#3e2723'
    },
    itemIcon: {
      fontSize: '24px',
      marginBottom: '5px'
    },
    itemName: {
      fontSize: '12px',
      color: '#ecf0f1',
      marginBottom: '5px'
    },
    itemQuantity: {
      fontSize: '10px',
      color: '#95a5a6'
    },
    questItem: {
      padding: '15px',
      backgroundColor: '#34495e',
      borderRadius: '8px',
      border: '2px solid #555',
      marginBottom: '10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    questIcon: {
      fontSize: '24px'
    },
    questInfo: {
      flex: 1
    },
    questTitle: {
      fontSize: '16px',
      color: '#f39c12',
      fontWeight: 'bold',
      marginBottom: '5px'
    },
    questGiver: {
      fontSize: '14px',
      color: '#95a5a6',
      marginBottom: '10px'
    },
    progressBar: {
      width: '100%',
      height: '6px',
      backgroundColor: '#555',
      borderRadius: '3px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#27ae60',
      transition: 'width 0.3s'
    },
    skillItem: {
      padding: '15px',
      backgroundColor: '#34495e',
      borderRadius: '8px',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    skillIcon: {
      fontSize: '24px'
    },
    skillInfo: {
      flex: 1
    },
    skillName: {
      fontSize: '16px',
      color: '#f39c12',
      fontWeight: 'bold',
      marginBottom: '5px'
    },
    skillDescription: {
      fontSize: '14px',
      color: '#ecf0f1',
      marginBottom: '10px'
    },
    skillProgress: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '5px'
    },
    skillLevel: {
      fontSize: '14px',
      color: '#ecf0f1'
    },
    skillExp: {
      fontSize: '12px',
      color: '#95a5a6'
    },
    skillBar: {
      width: '100%',
      height: '6px',
      backgroundColor: '#555',
      borderRadius: '3px',
      overflow: 'hidden'
    },
    skillFill: {
      height: '100%',
      backgroundColor: '#f39c12',
      transition: 'width 0.3s'
    },
    mapGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px',
      marginTop: '20px'
    },
    mapLocation: {
      padding: '20px',
      borderRadius: '8px',
      textAlign: 'center' as const,
      color: 'white',
      fontWeight: 'bold'
    },
    mapTitle: {
      fontSize: '20px',
      color: '#f39c12',
      textAlign: 'center' as const,
      marginBottom: '20px'
    },
    detailsPanel: {
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#34495e',
      borderRadius: '8px'
    },
    detailTitle: {
      fontSize: '18px',
      color: '#f39c12',
      marginBottom: '10px'
    },
    detailDescription: {
      fontSize: '14px',
      color: '#ecf0f1',
      marginBottom: '15px'
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
      marginTop: '15px'
    },
    useButton: {
      flex: 1,
      padding: '10px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    discardButton: {
      flex: 1,
      padding: '10px',
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold'
    }
  };

  const renderInventoryTab = () => (
    <div>
      <h3 style={{ color: '#f39c12', marginBottom: '15px' }}>Inventario</h3>
      <div style={styles.inventoryGrid}>
        {mockData.inventory.map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.inventoryItem,
              ...(selectedItem?.id === item.id ? styles.selectedItem : {})
            }}
            onClick={() => setSelectedItem(item)}
          >
            <div style={styles.itemIcon}>{item.icon}</div>
            <div style={styles.itemName}>{item.name}</div>
            <div style={styles.itemQuantity}>x{item.quantity}</div>
          </div>
        ))}
      </div>
      
      {selectedItem && (
        <div style={styles.detailsPanel}>
          <h4 style={styles.detailTitle}>{selectedItem.name}</h4>
          <p style={styles.detailDescription}>{selectedItem.description}</p>
          <div style={styles.actionButtons}>
            <button style={styles.useButton}>Usar</button>
            <button style={styles.discardButton}>Descartar</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderQuestsTab = () => (
    <div>
      <h3 style={{ color: '#f39c12', marginBottom: '15px' }}>Misiones Activas</h3>
      {mockData.quests.filter(q => q.status === 'active').map((quest, index) => (
        <div
          key={index}
          style={{
            ...styles.questItem,
            ...(selectedQuest?.id === quest.id ? styles.selectedItem : {})
          }}
          onClick={() => setSelectedQuest(quest)}
        >
          <div style={styles.questIcon}>{quest.icon}</div>
          <div style={styles.questInfo}>
            <div style={styles.questTitle}>{quest.title}</div>
            <div style={styles.questGiver}>{quest.giver}</div>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${(quest.progress / quest.maxProgress) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      ))}
      
      {selectedQuest && (
        <div style={styles.detailsPanel}>
          <h4 style={styles.detailTitle}>{selectedQuest.title}</h4>
          <p style={styles.detailDescription}>{selectedQuest.description}</p>
          <div>
            <strong style={{ color: '#f39c12' }}>Recompensas:</strong>
            <ul style={{ color: '#ecf0f1', marginTop: '10px' }}>
              <li>{selectedQuest.rewards.exp} EXP</li>
              <li>{selectedQuest.rewards.gold} Monedas de Oro</li>
              {selectedQuest.rewards.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const renderSkillsTab = () => (
    <div>
      <h3 style={{ color: '#f39c12', marginBottom: '15px' }}>Habilidades</h3>
      {mockData.skills.map((skill, index) => (
        <div key={index} style={styles.skillItem}>
          <div style={styles.skillIcon}>{skill.icon}</div>
          <div style={styles.skillInfo}>
            <div style={styles.skillName}>{skill.name}</div>
            <div style={styles.skillDescription}>{skill.description}</div>
            <div style={styles.skillProgress}>
              <span style={styles.skillLevel}>Nivel {skill.level}</span>
              <span style={styles.skillExp}>{skill.exp}/{skill.maxExp} EXP</span>
            </div>
            <div style={styles.skillBar}>
              <div 
                style={{
                  ...styles.skillFill,
                  width: `${(skill.exp / skill.maxExp) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMapTab = () => (
    <div>
      <h3 style={styles.mapTitle}>Mapa del Mundo</h3>
      <div style={styles.mapGrid}>
        {[
          { icon: '🌲', name: 'Bosque Encantado', color: '#2d5016' },
          { icon: '🏰', name: 'Castillo Real', color: '#4169e1' },
          { icon: '⛰️', name: 'Montañas Místicas', color: '#708090' },
          { icon: '🏘️', name: 'Aldea Inicial', color: '#8b7355' },
          { icon: '🔮', name: 'Torre del Mago', color: '#4b0082' },
          { icon: '🏴‍☠️', name: 'Cueva del Dragón', color: '#8b0000' },
        ].map((location, index) => (
          <div
            key={index}
            style={{
              ...styles.mapLocation,
              backgroundColor: location.color
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>{location.icon}</div>
            <div>{location.name}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>🦊 Aventura del Zorro Medieval</h2>
          <button 
            style={styles.closeButton}
            onClick={() => onGameStateChange({ showUI: false })}
          >
            ✕
          </button>
        </div>
        
        <div style={styles.tabs}>
          {[
            { id: 'inventory', label: '🎒 Inventario' },
            { id: 'quests', label: '⚔️ Misiones' },
            { id: 'skills', label: '🌟 Habilidades' },
            { id: 'map', label: '🗺️ Mapa' }
          ].map(tab => (
            <button
              key={tab.id}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div style={styles.content}>
          {activeTab === 'inventory' && renderInventoryTab()}
          {activeTab === 'quests' && renderQuestsTab()}
          {activeTab === 'skills' && renderSkillsTab()}
          {activeTab === 'map' && renderMapTab()}
        </div>
      </div>
    </div>
  );
};

export default GameUI;