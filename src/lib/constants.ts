export const INDUSTRIES = [
  "Technology",
  "Finance & Banking",
  "Healthcare",
  "Consulting",
  "Retail & E-commerce",
  "Media & Entertainment",
  "Education",
  "Government & Public Sector",
  "Manufacturing",
  "Real Estate",
  "Legal",
  "Non-profit",
  "Energy",
  "Telecommunications",
  "Transportation & Logistics",
  "Hospitality & Tourism",
  "Other",
] as const;

export const SENIORITY_LABELS: Record<string, string> = {
  intern: "Intern",
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
  staff: "Staff",
  principal: "Principal",
  director: "Director",
  vp: "VP",
  c_level: "C-Level",
};

export const INTERVIEW_TYPE_LABELS: Record<string, string> = {
  onsite: "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
  phone_screen: "Phone Screen",
  take_home: "Take-home Task",
  mixed: "Mixed",
};

export const OUTCOME_LABELS: Record<string, string> = {
  offer: "Received Offer",
  rejected: "Rejected",
  ghosted: "Ghosted",
  withdrew: "Withdrew",
  pending: "Still Pending",
};

export const RATING_LABELS = {
  professionalism_rating: "Professionalism",
  communication_rating: "Communication",
  clarity_rating: "Clarity",
  fairness_rating: "Fairness",
} as const;

export const FLAG_LABELS = {
  received_feedback: {
    label: "Received feedback",
    description: "Did the company provide feedback on your application or interview?",
    positive: true,
    followUps: [
      {
        id: "feedback_timing",
        label: "How quickly did you receive feedback?",
        type: "select" as const,
        options: ["Within 24 hours", "Within a week", "Within 2 weeks", "Over 2 weeks"],
      },
      {
        id: "feedback_quality",
        label: "How useful was the feedback?",
        type: "select" as const,
        options: ["Very detailed & actionable", "Helpful but generic", "Vague / not useful", "Just a rejection with no detail"],
      },
      {
        id: "feedback_detail",
        label: "Any detail on the feedback you received?",
        type: "text" as const,
        placeholder: "e.g. They gave specific notes on my technical task...",
      },
    ],
  },
  unpaid_task: {
    label: "Asked to complete unpaid work",
    description: "Were you asked to do a substantial task without compensation?",
    positive: false,
    followUps: [
      {
        id: "unpaid_task_hours",
        label: "Roughly how many hours did it take?",
        type: "select" as const,
        options: ["Under 1 hour", "1-3 hours", "3-8 hours", "Over 8 hours"],
      },
      {
        id: "unpaid_task_type",
        label: "What type of task was it?",
        type: "select" as const,
        options: ["Technical / coding challenge", "Design brief", "Written case study", "Presentation / pitch", "Strategy document", "Other"],
      },
      {
        id: "unpaid_task_detail",
        label: "Did it feel like real work they could use?",
        type: "text" as const,
        placeholder: "e.g. It was a live client brief and felt like free consultancy...",
      },
    ],
  },
  ghosted: {
    label: "Ghosted",
    description: "Did the company stop responding without explanation?",
    positive: false,
    followUps: [
      {
        id: "ghosted_stage",
        label: "At what stage were you ghosted?",
        type: "select" as const,
        options: ["After applying", "After initial screen", "After technical round", "After final round", "After verbal offer"],
      },
      {
        id: "ghosted_followup",
        label: "Did you try to follow up?",
        type: "select" as const,
        options: ["Yes, no response", "Yes, got a response eventually", "No, I moved on"],
      },
    ],
  },
  interviewer_late: {
    label: "Interviewers late or unprepared",
    description: "Were interviewers late, no-shows, or clearly unprepared?",
    positive: false,
    followUps: [
      {
        id: "late_detail",
        label: "What happened?",
        type: "select" as const,
        options: ["Interviewer was late (10+ mins)", "Interviewer was a no-show", "Interviewer hadn't read my CV", "Wrong interviewer / different role", "Interview was rescheduled last minute"],
      },
    ],
  },
  exceeded_timeline: {
    label: "Process exceeded stated timeline",
    description: "Did the process take longer than the company originally stated?",
    positive: false,
    followUps: [
      {
        id: "timeline_stated",
        label: "What timeline did they originally state?",
        type: "select" as const,
        options: ["1 week", "2 weeks", "3-4 weeks", "Over a month", "They didn't give a timeline"],
      },
      {
        id: "timeline_actual",
        label: "How long did it actually take?",
        type: "select" as const,
        options: ["1-2 weeks longer", "3-4 weeks longer", "Over a month longer", "Still waiting"],
      },
    ],
  },
} as const;

export const MODERATION_REASONS = [
  "Inappropriate language",
  "Personal attack on individuals",
  "Spam or promotional content",
  "Suspected fake review",
  "Contains confidential information",
  "Other",
] as const;
