import React from 'react';
import WordCloud from 'react-wordcloud';

interface NewsWordCloudProps {
  data: any;
}

const NewsWordCloud: React.FC<NewsWordCloudProps> = ({ data }) => {
  return <WordCloud words={data.keywords} />;
};

export default NewsWordCloud;
