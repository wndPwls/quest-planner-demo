import type { CharacterSpecies } from '../types';
import FoxCharacter from './FoxCharacter';
import BearCharacter from './BearCharacter';
import RabbitCharacter from './RabbitCharacter';
import ChickCharacter from './ChickCharacter';

interface Props {
  species: CharacterSpecies;
  size?: number;
}

const COMPONENTS: Record<CharacterSpecies, React.ComponentType<{ size?: number }>> = {
  fox: FoxCharacter,
  bear: BearCharacter,
  rabbit: RabbitCharacter,
  chick: ChickCharacter,
};

export default function CharacterAvatar({ species, size = 80 }: Props) {
  const Component = COMPONENTS[species] ?? FoxCharacter;
  return <Component size={size} />;
}
