"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle, XCircle, Trash2, MessageSquare } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    fetch("/api/reviews?admin=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModeration = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update review status");
      }
      fetchReviews();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete review");
      }
      fetchReviews();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-shyvon-gold/20 pb-4">
        <span className="text-xs uppercase font-cinzel text-shyvon-gold tracking-widest">
          Customer Feedback
        </span>
        <h1 className="font-cinzel text-2xl font-extrabold text-white">
          Review <span className="text-gold-gradient">Moderation</span>
        </h1>
        <p className="text-xs text-shyvon-muted mt-0.5">
          Approve, hide, or remove customer product testimonials before public display.
        </p>
      </div>

      <div className="bg-[#0A101D] border border-shyvon-gold/25 rounded overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-shyvon-gold">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-xs text-shyvon-muted space-y-2">
            <MessageSquare className="w-8 h-8 text-shyvon-gold mx-auto" />
            <p>No customer reviews submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-shyvon-gold/30 bg-black/40 text-shyvon-goldLight font-cinzel font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-2 text-left">Reviewer</th>
                  <th className="py-3 px-2 text-left">Rating</th>
                  <th className="py-3 px-2 text-left">Title & Comment</th>
                  <th className="py-3 px-2 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-cinzel font-bold text-white">
                      {r.product?.name}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="font-semibold text-gray-200 block">{r.customerName}</span>
                      <span className="text-[11px] text-shyvon-muted">{r.customerEmail || "—"}</span>
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="flex text-shyvon-gold">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-shyvon-gold" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-2 max-w-sm">
                      <strong className="text-shyvon-goldLight block">{r.title}</strong>
                      <p className="text-gray-300 line-clamp-2">{r.comment}</p>
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          r.isApproved
                            ? "bg-green-500/20 text-green-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {r.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {r.isApproved ? (
                          <button
                            onClick={() => handleModeration(r.id, false)}
                            className="px-2 py-1 rounded bg-yellow-950/60 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-900 text-[10px]"
                            title="Hide Review"
                          >
                            Hide
                          </button>
                        ) : (
                          <button
                            onClick={() => handleModeration(r.id, true)}
                            className="px-2 py-1 rounded bg-green-950/60 border border-green-500/40 text-green-300 hover:bg-green-900 text-[10px]"
                            title="Approve Review"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1 text-gray-500 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
