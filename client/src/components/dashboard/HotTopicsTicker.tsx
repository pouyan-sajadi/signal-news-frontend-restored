import React from 'react';

interface HotTopicsTickerProps {
  data: any;
}

const HotTopicsTicker: React.FC<HotTopicsTickerProps> = ({ data }) => {
  return (
    <div className="overflow-hidden">
      <div className="flex animate-ticker">
        {data.hot_topics.map((topic: any, index: number) => (
          <div key={index} className="flex-shrink-0 mx-4 p-4 border rounded-lg">
            <h3 className="font-bold">{topic.topic}</h3>
            <p>{topic.summary}</p>
            <p className="text-sm text-gray-500">Trend: {topic.trend}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotTopicsTicker;
