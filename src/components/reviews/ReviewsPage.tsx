import React, { useState } from 'react';
import { Star, ThumbsUp, Plus, X } from 'lucide-react';
import { DoctorReview } from '../../types';
import { initialReviews } from '../../services/mockData';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<DoctorReview[]>(initialReviews as any);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [doctorName, setDoctorName] = useState('Dr. Ananya Sen');
  const [hospitalName, setHospitalName] = useState('SCB Medical College');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('Doctor explained the treatment very clearly in Odia language. Highly recommended!');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev: DoctorReview = {
      id: `rev_${Date.now()}`,
      doctorName,
      hospitalName,
      rating,
      waitingTimeRating: 4,
      listeningSkillRating: 5,
      cleanlinessRating: 5,
      reviewText,
      authorName: 'Anonymous Patient',
      date: 'Today',
      verifiedPatient: true,
      helpfulVotesCount: 0
    };
    setReviews([newRev, ...reviews]);
    setIsAddModalOpen(false);
  };

  const handleVoteHelpful = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, helpfulVotesCount: r.helpfulVotesCount + 1 } : r));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            Community Insights
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
            Healthcare Reviews
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Community feedback on doctor consultations, wait times, and facility hygiene.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Write Review</span>
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{rev.doctorName}</h3>
                  {rev.verifiedPatient && (
                    <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{rev.hospitalName} • {rev.date}</p>
              </div>

              {/* Star Score */}
              <div className="flex items-center gap-1 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                <Star className="w-3.5 h-3.5 text-zinc-500 fill-zinc-500" />
                <span>{rev.rating}.0 / 5.0</span>
              </div>
            </div>

            {/* Sub-ratings */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
              <div>
                <span className="block text-[10px] text-zinc-400">Listening</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{rev.listeningSkillRating}★</span>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-400">Wait Time</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{rev.waitingTimeRating}★</span>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-400">Cleanliness</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{rev.cleanlinessRating}★</span>
              </div>
            </div>

            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              "{rev.reviewText}"
            </p>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>By {rev.authorName}</span>
              <button
                onClick={() => handleVoteHelpful(rev.id)}
                className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <ThumbsUp className="w-3 h-3 text-zinc-400" />
                <span>Helpful ({rev.helpfulVotesCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddReview} className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Write Patient Review</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Needs Improvement</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Review Feedback</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default ReviewsPage;
