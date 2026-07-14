import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Brain, Sparkles, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';
import { insightsAPI } from '../services/api.js';

export default function AIInsights({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const data = await insightsAPI.getAll();
      setInsights(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    setGenerating(true);
    setMessage('');

    try {
      await insightsAPI.generate();
      setMessage({ type: 'success', text: 'AI insights generated successfully!' });
      fetchInsights();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to generate insights. Please try again.' });
    } finally {
      setGenerating(false);
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="w-5 h-5 text-primary-green" />;
      case 'warning':
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-primary-red" />;
      case 'streak':
        return <TrendingUp className="w-5 h-5 text-primary-blue" />;
      case 'recent':
        return <Sparkles className="w-5 h-5 text-primary-cyan" />;
      default:
        return <Brain className="w-5 h-5 text-primary-amber" />;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'excellent':
      case 'good':
        return 'bg-primary-green/10 border-primary-green';
      case 'warning':
      case 'critical':
        return 'bg-primary-red/10 border-primary-red';
      case 'streak':
        return 'bg-primary-blue/10 border-primary-blue';
      case 'recent':
        return 'bg-primary-cyan/10 border-primary-cyan';
      default:
        return 'bg-primary-amber/10 border-primary-amber';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 bg-primary-red/10 text-primary-red rounded text-xs font-medium">High</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-primary-amber/10 text-primary-amber rounded text-xs font-medium">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 bg-primary-green/10 text-primary-green rounded text-xs font-medium">Low</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <Navigation user={user} onLogout={onLogout} isOpen={isOpen} setIsOpen={setIsOpen} />
      
      <main className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">AI Insights</h1>
              <p className="text-gray-600 mt-2">Smart activity monitoring and personalized recommendations</p>
            </div>
            <button
              onClick={handleGenerateInsights}
              disabled={generating}
              className="px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Generate New Insights
                </>
              )}
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-primary-green/10 text-primary-green border border-primary-green' 
                : 'bg-primary-red/10 text-primary-red border border-primary-red'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* AI Info Banner */}
          <div className="bg-gradient-to-r from-primary-blue/10 to-primary-cyan/10 border border-primary-blue rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-blue rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">AI-Powered Analysis</h3>
                <p className="text-sm text-gray-600">
                  Our AI analyzes your attendance patterns to provide personalized insights, 
                  identify trends, and offer actionable recommendations to improve your academic performance.
                </p>
              </div>
            </div>
          </div>

          {/* Insights Grid */}
          {insights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.map((insight) => (
                <div key={insight.id} className={`p-6 rounded-xl border-2 ${getInsightColor(insight.insight_type)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center">
                        {getInsightIcon(insight.insight_type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 capitalize">
                          {insight.insight_type.replace('_', ' ')}
                        </h3>
                        {getPriorityBadge(insight.priority)}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(insight.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{insight.insight_text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Insights Yet</h3>
              <p className="text-gray-500 mb-6">Generate your first AI insights to see personalized analysis of your attendance patterns.</p>
              <button
                onClick={handleGenerateInsights}
                disabled={generating}
                className="px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Insights
                  </>
                )}
              </button>
            </div>
          )}

          {/* How It Works */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">How AI Insights Work</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-blue">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Data Collection</h3>
                  <p className="text-sm text-gray-600">AI analyzes your attendance history, patterns, and trends</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-blue">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Pattern Recognition</h3>
                  <p className="text-sm text-gray-600">Identifies attendance patterns, streaks, and areas for improvement</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary-blue">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Personalized Insights</h3>
                  <p className="text-sm text-gray-600">Generates actionable recommendations tailored to your needs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
