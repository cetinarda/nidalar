// Nida: Nidalar'daki 9 gelenekten 72 söz (kaynak: src/data/wisdom_tr.json).
// Galiba'da söz rastgele gelir; anlamını kullanıcı verir.
import books from './nidalar.json';

export type Book = {
  id: string; title: string; author: string; tradition: string; emoji: string; color: string;
  passages: { id: string; theme: string; ref: string; text: string }[];
};
export type Passage = Book['passages'][number] & { book: Book };

export const BOOKS = books as Book[];
export const PASSAGES: Passage[] = BOOKS.flatMap(book => book.passages.map(p => ({ ...p, book })));

export const passageById = (id: string) => PASSAGES.find(p => p.id === id);

export function drawPassage(exclude?: string): Passage {
  const pool = PASSAGES.filter(p => p.id !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}
