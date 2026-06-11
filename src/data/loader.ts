import { useMemo } from 'react';
import { useLanguage } from '../i18n/useLanguage';

import wisdomTR from './wisdom_tr.json';
import wisdomEN from './wisdom_en.json';

export type Passage = {
  id: string;
  theme: string;
  ref: string;
  text: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  tradition: string;
  emoji: string;
  color: string;
  passages: Passage[];
};

export type FlatPassage = Passage & {
  bookId: string;
  bookTitle: string;
  author: string;
  emoji: string;
  color: string;
};

export function useData() {
  const { lang } = useLanguage();

  return useMemo(() => {
    const books = (lang === 'en' ? wisdomEN : wisdomTR) as Book[];
    const passages: FlatPassage[] = books.flatMap(book =>
      book.passages.map(p => ({
        ...p,
        bookId: book.id,
        bookTitle: book.title,
        author: book.author,
        emoji: book.emoji,
        color: book.color,
      })),
    );

    return { books, passages, lang };
  }, [lang]);
}
