import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { mockData } from '../../data/mockData';

const GameUI = ({ gameState, onGameStateChange, isVisible }) => {
  const [activeTab, setActiveTab] = useState('inventory');

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[600px] h-[500px] bg-gray-900 text-white border-amber-600">
        <CardHeader>
          <CardTitle className="text-center text-amber-400">
            🦊 Aventura del Zorro Medieval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="inventory" className="text-amber-400">
                Inventario
              </TabsTrigger>
              <TabsTrigger value="quests" className="text-amber-400">
                Misiones
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-amber-400">
                Habilidades
              </TabsTrigger>
              <TabsTrigger value="map" className="text-amber-400">
                Mapa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inventory" className="h-full">
              <InventoryTab />
            </TabsContent>

            <TabsContent value="quests" className="h-full">
              <QuestsTab />
            </TabsContent>

            <TabsContent value="skills" className="h-full">
              <SkillsTab />
            </TabsContent>

            <TabsContent value="map" className="h-full">
              <MapTab />
            </TabsContent>
          </Tabs>

          <div className="mt-4 flex justify-center">
            <Button 
              onClick={() => onGameStateChange({ showUI: false })}
              className="bg-amber-600 hover:bg-amber-700 text-black"
            >
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InventoryTab = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-amber-400">Objetos</h3>
        <ScrollArea className="h-60">
          <div className="grid grid-cols-4 gap-2">
            {mockData.inventory.map((item, index) => (
              <div
                key={index}
                className={`p-2 border rounded cursor-pointer transition-colors ${
                  selectedItem?.id === item.id 
                    ? 'border-amber-400 bg-amber-900' 
                    : 'border-gray-600 hover:border-amber-600'
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="text-2xl text-center">{item.icon}</div>
                <div className="text-xs text-center">{item.name}</div>
                <div className="text-xs text-center text-gray-400">x{item.quantity}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-amber-400">Detalles</h3>
        {selectedItem ? (
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-300">{selectedItem.name}</h4>
            <p className="text-sm text-gray-300">{selectedItem.description}</p>
            <div className="space-y-1">
              <Badge variant="outline" className="text-amber-400">
                Tipo: {selectedItem.type}
              </Badge>
              <Badge variant="outline" className="text-green-400">
                Cantidad: {selectedItem.quantity}
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Usar
              </Button>
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Descartar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Selecciona un objeto para ver sus detalles</p>
        )}
      </div>
    </div>
  );
};

const QuestsTab = () => {
  const [selectedQuest, setSelectedQuest] = useState(null);

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-amber-400">Misiones Activas</h3>
        <ScrollArea className="h-60">
          <div className="space-y-2">
            {mockData.quests.filter(q => q.status === 'active').map((quest, index) => (
              <div
                key={index}
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  selectedQuest?.id === quest.id 
                    ? 'border-amber-400 bg-amber-900' 
                    : 'border-gray-600 hover:border-amber-600'
                }`}
                onClick={() => setSelectedQuest(quest)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{quest.icon}</span>
                  <div>
                    <h4 className="font-semibold text-amber-300">{quest.title}</h4>
                    <p className="text-sm text-gray-400">{quest.giver}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-amber-400">Detalles de Misión</h3>
        {selectedQuest ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedQuest.icon}</span>
              <h4 className="font-semibold text-amber-300">{selectedQuest.title}</h4>
            </div>
            <p className="text-sm text-gray-300">{selectedQuest.description}</p>
            <div className="space-y-1">
              <Badge variant="outline" className="text-blue-400">
                Tipo: {selectedQuest.type}
              </Badge>
              <Badge variant="outline" className="text-green-400">
                Progreso: {selectedQuest.progress}/{selectedQuest.maxProgress}
              </Badge>
            </div>
            <div className="mt-4">
              <h5 className="font-semibold text-amber-400">Recompensas:</h5>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• {selectedQuest.rewards.exp} EXP</li>
                <li>• {selectedQuest.rewards.gold} Monedas de Oro</li>
                {selectedQuest.rewards.items.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Selecciona una misión para ver sus detalles</p>
        )}
      </div>
    </div>
  );
};

const SkillsTab = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">Habilidades del Zorro</h3>
      <div className="grid grid-cols-2 gap-4">
        {mockData.skills.map((skill, index) => (
          <div key={index} className="p-3 border border-gray-600 rounded">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{skill.icon}</span>
              <h4 className="font-semibold text-amber-300">{skill.name}</h4>
            </div>
            <p className="text-sm text-gray-300 mb-2">{skill.description}</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Nivel {skill.level}</span>
                <span className="text-sm">{skill.exp}/{skill.maxExp} EXP</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-amber-400 h-2 rounded-full transition-all"
                  style={{ width: `${(skill.exp / skill.maxExp) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MapTab = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">Mapa del Mundo</h3>
      <div className="border border-gray-600 rounded p-4 bg-gray-800">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-green-900 rounded">
            <div className="text-2xl mb-2">🌲</div>
            <div className="text-sm">Bosque Encantado</div>
          </div>
          <div className="p-4 bg-blue-900 rounded">
            <div className="text-2xl mb-2">🏰</div>
            <div className="text-sm">Castillo Real</div>
          </div>
          <div className="p-4 bg-gray-700 rounded">
            <div className="text-2xl mb-2">⛰️</div>
            <div className="text-sm">Montañas Místicas</div>
          </div>
          <div className="p-4 bg-yellow-900 rounded">
            <div className="text-2xl mb-2">🏘️</div>
            <div className="text-sm">Aldea Inicial</div>
          </div>
          <div className="p-4 bg-purple-900 rounded">
            <div className="text-2xl mb-2">🔮</div>
            <div className="text-sm">Torre del Mago</div>
          </div>
          <div className="p-4 bg-red-900 rounded">
            <div className="text-2xl mb-2">🏴‍☠️</div>
            <div className="text-sm">Cueva del Dragón</div>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-400 text-center">
        Usa las teclas de dirección para explorar el mundo
      </div>
    </div>
  );
};

export default GameUI;