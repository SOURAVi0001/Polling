/**
 * LivePollResults for the Teacher Dashboard.
 * Matches Screenshot 2025-12-03 at 9.39.09 AM.png
 */
import React from 'react';
import { PollOption } from './PollOption';
import { Button } from './Button';
import { Plus } from 'lucide-react';

export function LivePollResults({ poll, onEndPoll, onNewQuestion, isTeacher = false }) {
      if (!poll) return null;

      const totalVotes = poll.totalVotes || 0;

      return (
            <div className="w-full max-w-4xl mx-auto animate-in">
                  <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Question</h2>
                  </div>

                  <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-[#595959] p-4 px-6">
                              <h3 className="text-white text-lg font-medium">{poll.question}</h3>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-3">
                              {poll.options?.map((opt, i) => {
                                    const pct = totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0;
                                    return (
                                          <PollOption
                                                key={i}
                                                index={i}
                                                text={opt.text}
                                                votes={opt.votes}
                                                percentage={pct}
                                                showVotes={true}
                                          />
                                    );
                              })}
                        </div>
                  </div>

                  {/* Student Responses List - Only for Teacher */}
                  {isTeacher && (
                        <div className="mt-8 bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                              <div className="bg-gray-50 p-4 px-6 border-b border-gray-100">
                                    <h3 className="text-gray-900 text-lg font-bold">Student Responses ({poll.answers?.length || 0})</h3>
                              </div>
                              <div className="p-0">
                                    {poll.answers && poll.answers.length > 0 ? (
                                          <div className="divide-y divide-gray-100">
                                                {poll.answers.map((ans, idx) => (
                                                      <div key={idx} className="p-4 px-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-[#5B4EF0] flex items-center justify-center font-bold text-xs">
                                                                        {ans.name?.charAt(0).toUpperCase()}
                                                                  </div>
                                                                  <span className="font-medium text-gray-900">{ans.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                  <span className="text-sm text-gray-500">Answered:</span>
                                                                  <span className="font-bold text-[#5B4EF0]">
                                                                        {ans.optionIndex >= 0 && poll.options[ans.optionIndex] 
                                                                              ? poll.options[ans.optionIndex].text 
                                                                              : 'No Answer'}
                                                                  </span>
                                                            </div>
                                                      </div>
                                                ))}
                                          </div>
                                    ) : (
                                          <div className="p-8 text-center text-gray-400">
                                                No responses yet
                                          </div>
                                    )}
                              </div>
                        </div>
                  )}

                  {/* Footer Actions */}
                  {/* Show "Ask a new question" if poll is inactive OR if we want to force end it */}
                  {isTeacher ? (
                        <div className="flex justify-end mt-8">
                              <Button 
                                    onClick={onNewQuestion} 
                                    disabled={poll.isActive}
                                    className="rounded-full px-8 py-3 text-lg"
                              >
                                    <Plus size={20} className="mr-2" />
                                    Ask a new question
                              </Button>
                        </div>
                  ) : (
                        !poll.isActive && (
                              <div className="mt-12 text-center">
                                    <h3 className="text-2xl font-bold text-gray-900">Wait for the teacher to ask a new question..</h3>
                              </div>
                        )
                  )}
            </div>
      );
}