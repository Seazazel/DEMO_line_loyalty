import { FlexMessage } from '@line/bot-sdk';
import { ServiceCenter } from '../types/message.interface';



function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function findNearbyServiceCenters(userLat: number, userLng: number): Promise<ServiceCenter[]> {
  const mockCenters: ServiceCenter[] = [
    { name: 'ศูนย์บริการลาดพร้าว', address: 'ถนนลาดพร้าว', lat: 13.815, lng: 100.603 },
    { name: 'ศูนย์บริการรัชดา', address: 'ถนนรัชดาภิเษก', lat: 13.787, lng: 100.571 },
    { name: 'ศูนย์บริการบางนา', address: 'ถนนบางนา', lat: 13.669, lng: 100.607 },
  ];

  return mockCenters
    .map(center => ({
      ...center,
      distance: haversineDistance(userLat, userLng, center.lat, center.lng),
    }))
    .filter(center => center.distance <= 10) // ✅ only within 10 km
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3); // return top 3 nearby (optional)
}

export function buildNearbyLocationFlex(centers: ServiceCenter[]): FlexMessage {
  return {
    type: 'flex',
    altText: 'ศูนย์บริการใกล้คุณ',
    contents: {
      type: 'carousel',
      contents: centers.map(center => ({
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: center.name,
              weight: 'bold',
              size: 'md',
              wrap: true
            },
            {
              type: 'text',
              text: center.address,
              size: 'sm',
              color: '#666666',
              wrap: true
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              style: 'link',
              action: {
                type: 'uri',
                label: 'ดูแผนที่',
                uri: `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`
              }
            }
          ]
        }
      }))
    }
  };
}
