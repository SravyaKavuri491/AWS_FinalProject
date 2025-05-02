import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';

const MapWithNoSSR = dynamic(
  () => import('./MapComponent'),
  { ssr: false }
);

interface EventMapProps {
  events: {
    title: string;
    location: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  }[];
}

export default function EventMap({ events }: EventMapProps) {
  return (
    <Box height="400px" borderRadius="xl" overflow="hidden" boxShadow="lg">
      <MapWithNoSSR events={events} />
    </Box>
  );
}