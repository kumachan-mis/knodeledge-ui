'use client';
import { useLoadableChapterList } from '@/contexts/chapters';

import ChapterListComponent from './ChapterList';

import React from 'react';

const ChapterList: React.FC = () => {
  const loadableChapterList = useLoadableChapterList();
  return <ChapterListComponent loadableChapterList={loadableChapterList} />;
};

export default ChapterList;
