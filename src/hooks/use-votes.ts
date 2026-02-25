"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface VoteState {
  userVote: "helpful" | "unhelpful" | null;
  helpfulCount: number;
  unhelpfulCount: number;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useVotes(interviewId: string) {
  const [state, setState] = useState<VoteState>({
    userVote: null,
    helpfulCount: 0,
    unhelpfulCount: 0,
    isLoading: true,
    isAuthenticated: false,
  });

  // Fetch initial vote data
  useEffect(() => {
    async function loadVotes() {
      const supabase = createClient();

      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Fetch all votes for this interview
      const { data: votes } = await supabase
        .from("interview_votes")
        .select("user_id, vote_type")
        .eq("interview_id", interviewId);

      const allVotes = votes ?? [];
      const helpfulCount = allVotes.filter((v) => v.vote_type === "helpful").length;
      const unhelpfulCount = allVotes.filter((v) => v.vote_type === "unhelpful").length;
      const userVote = user
        ? (allVotes.find((v) => v.user_id === user.id)?.vote_type as
            | "helpful"
            | "unhelpful"
            | undefined) ?? null
        : null;

      setState({
        userVote,
        helpfulCount,
        unhelpfulCount,
        isLoading: false,
        isAuthenticated: !!user,
      });
    }

    loadVotes();
  }, [interviewId]);

  const handleVote = useCallback(
    async (type: "helpful" | "unhelpful") => {
      if (!state.isAuthenticated) return;

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const previousVote = state.userVote;

      if (previousVote === type) {
        // Toggle off: optimistic remove
        setState((prev) => ({
          ...prev,
          userVote: null,
          helpfulCount:
            type === "helpful" ? prev.helpfulCount - 1 : prev.helpfulCount,
          unhelpfulCount:
            type === "unhelpful"
              ? prev.unhelpfulCount - 1
              : prev.unhelpfulCount,
        }));

        const { error } = await supabase
          .from("interview_votes")
          .delete()
          .eq("interview_id", interviewId)
          .eq("user_id", user.id);

        if (error) {
          // Revert on error
          setState((prev) => ({
            ...prev,
            userVote: previousVote,
            helpfulCount:
              type === "helpful" ? prev.helpfulCount + 1 : prev.helpfulCount,
            unhelpfulCount:
              type === "unhelpful"
                ? prev.unhelpfulCount + 1
                : prev.unhelpfulCount,
          }));
        }
      } else {
        // New vote or switch: optimistic update
        setState((prev) => ({
          ...prev,
          userVote: type,
          helpfulCount:
            type === "helpful"
              ? prev.helpfulCount + 1
              : previousVote === "helpful"
                ? prev.helpfulCount - 1
                : prev.helpfulCount,
          unhelpfulCount:
            type === "unhelpful"
              ? prev.unhelpfulCount + 1
              : previousVote === "unhelpful"
                ? prev.unhelpfulCount - 1
                : prev.unhelpfulCount,
        }));

        if (previousVote) {
          // Update existing vote
          const { error } = await supabase
            .from("interview_votes")
            .update({ vote_type: type })
            .eq("interview_id", interviewId)
            .eq("user_id", user.id);

          if (error) {
            setState((prev) => ({
              ...prev,
              userVote: previousVote,
              helpfulCount:
                type === "helpful"
                  ? prev.helpfulCount - 1
                  : previousVote === "helpful"
                    ? prev.helpfulCount + 1
                    : prev.helpfulCount,
              unhelpfulCount:
                type === "unhelpful"
                  ? prev.unhelpfulCount - 1
                  : previousVote === "unhelpful"
                    ? prev.unhelpfulCount + 1
                    : prev.unhelpfulCount,
            }));
          }
        } else {
          // Insert new vote
          const { error } = await supabase.from("interview_votes").insert({
            interview_id: interviewId,
            user_id: user.id,
            vote_type: type,
          });

          if (error) {
            setState((prev) => ({
              ...prev,
              userVote: null,
              helpfulCount:
                type === "helpful"
                  ? prev.helpfulCount - 1
                  : prev.helpfulCount,
              unhelpfulCount:
                type === "unhelpful"
                  ? prev.unhelpfulCount - 1
                  : prev.unhelpfulCount,
            }));
          }
        }
      }
    },
    [interviewId, state.isAuthenticated, state.userVote]
  );

  return {
    ...state,
    handleVote,
  };
}
