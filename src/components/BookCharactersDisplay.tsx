import { BookCharacters } from '@/components/BookCharacters';

interface BookCharactersDisplayProps {
  bookId: string;
  className?: string;
}

export const BookCharactersDisplay = ({ bookId, className }: BookCharactersDisplayProps) => {
  return <BookCharacters bookId={bookId} className={className} />;
};