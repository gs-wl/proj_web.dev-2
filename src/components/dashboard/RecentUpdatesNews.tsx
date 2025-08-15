'use client';

import React, { useState } from 'react';
import { FileText, Twitter, Newspaper, Clock } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  timeAgo: string;
  type: 'blog' | 'twitter' | 'news';
}

interface RecentUpdatesNewsProps {
  newsItems?: NewsItem[];
}

const defaultNewsItems: NewsItem[] = [
  {
    id: '1',
    title: 'New Partnership with EcoInnovate announced.',
    timeAgo: '2 hours ago',
    type: 'blog'
  },
  {
    id: '2',
    title: 'Q3 2024 Roadmap Update: What\'s coming next.',
    timeAgo: '1 day ago',
    type: 'blog'
  },
  {
    id: '3',
    title: 'How we are using blockchain to support sustainable projects.',
    timeAgo: '3 days ago',
    type: 'blog'
  },
  {
    id: '4',
    title: 'Major breakthrough in renewable energy tokenization announced!',
    timeAgo: '5 hours ago',
    type: 'twitter'
  },
  {
    id: '5',
    title: 'Global renewable energy market reaches new milestone.',
    timeAgo: '1 day ago',
    type: 'news'
  }
];

const RecentUpdatesNews = ({ newsItems = defaultNewsItems }: RecentUpdatesNewsProps) => {
  const [activeTab, setActiveTab] = useState<'blog' | 'twitter' | 'news'>('blog');

  const filteredNews = newsItems.filter(item => item.type === activeTab);

  const getIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <FileText className="text-blue-500" />;
      case 'twitter':
        return <Twitter className="text-blue-400" />;
      case 'news':
        return <Newspaper className="text-green-500" />;
      default:
        return <FileText className="text-blue-500" />;
    }
  };

  const tabs = [
    { id: 'blog', label: 'Our Blog', icon: FileText },
    { id: 'twitter', label: 'Twitter', icon: Twitter },
    { id: 'news', label: 'AI News', icon: Newspaper }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Updates & News</h2>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'blog' | 'twitter' | 'news')}
              className={`flex-1 py-2 px-4 text-center font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* News Items */}
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <div key={item.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="flex-shrink-0 mt-1">
                {getIcon(item.type)}
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-gray-900 dark:text-white text-sm leading-relaxed">
                  {item.title}
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {item.timeAgo}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No {activeTab} updates available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentUpdatesNews;