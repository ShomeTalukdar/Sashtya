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
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
            <span>Healthcare Reviews & Ratings</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Verified community feedback on doctors, OPD waiting times, & hospital facilities.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0057B8] hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write Patient Review</span>
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-lg">{rev.doctorName}</h3>
                  {rev.verifiedPatient && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                      Verified Patient
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">{rev.hospitalName} • {rev.date}</p>
              </div>

              {/* Star Score */}
              <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-900 font-black text-sm">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{rev.rating}.0 / 5.0</span>
              </div>
            </div>

            {/* Sub-ratings */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-2xl">
              <div>
                <span className="block text-[10px] text-slate-400">Listening Skill</span>
                <span className="font-extrabold text-slate-800">{rev.listeningSkillRating}★</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">Waiting Time</span>
                <span className="font-extrabold text-slate-800">{rev.waitingTimeRating}★</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">Cleanliness</span>
                <span className="font-extrabold text-slate-800">{rev.cleanlinessRating}★</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
              "{rev.reviewText}"
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>By {rev.authorName}</span>
              <button
                onClick={() => handleVoteHelpful(rev.id)}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({rev.helpfulVotesCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD REVIEW MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddReview} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900">Write Doctor / Hospital Review</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-bold text-slate-900"
                >
                  <option value={5}>5 Stars - Outstanding Care</option>
                  <option value={4}>4 Stars - Good Experience</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Needs Improvement</option>
                  <option value={1}>1 Star - Poor Experience</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Review Feedback</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-semibold text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0057B8] hover:bg-blue-800 text-white font-extrabold text-xs shadow-md"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
