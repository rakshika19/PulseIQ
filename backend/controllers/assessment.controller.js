import { asyncHandler } from "../utils/asyncHandler.js";

const PHQ9_OPTIONS = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day",
];

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself—or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite—being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way",
].map((text, i) => ({
  q_id: `phq9_${i + 1}`,
  text,
  options: PHQ9_OPTIONS,
}));

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
].map((text, i) => ({
  q_id: `gad7_${i + 1}`,
  text,
  options: PHQ9_OPTIONS,
}));

function getPHQ9Severity(totalScore) {
  if (totalScore <= 4) return "minimal";
  if (totalScore <= 9) return "mild";
  if (totalScore <= 14) return "moderate";
  if (totalScore <= 19) return "moderately_severe";
  return "severe";
}

function getGAD7Severity(totalScore) {
  if (totalScore <= 4) return "minimal";
  if (totalScore <= 9) return "mild";
  if (totalScore <= 14) return "moderate";
  return "severe";
}

export const getQuestions = asyncHandler(async (req, res) => {
  const { assessment_type, context } = req.body || {};
  const type = (assessment_type || "PHQ9").toUpperCase();

  let questions;
  if (type === "GAD7") {
    questions = GAD7_QUESTIONS;
  } else {
    questions = PHQ9_QUESTIONS;
  }

  res.status(200).json(questions);
});

export const submitAssessment = asyncHandler(async (req, res) => {
  const { assessment_type, responses, context } = req.body || {};
  const type = (assessment_type || "PHQ9").toUpperCase();

  const total_score = (responses || []).reduce((sum, r) => sum + (Number(r.answer) || 0), 0);

  let severity, message;
  if (type === "GAD7") {
    severity = getGAD7Severity(total_score);
    message =
      severity === "minimal"
        ? "Your anxiety levels appear to be in a healthy range. Continue practices that support your wellbeing."
        : severity === "mild"
          ? "You may be experiencing some anxiety. Consider stress-reduction techniques and self-care."
          : severity === "moderate"
            ? "Your responses suggest moderate anxiety. Reaching out to a counselor or healthcare provider can help."
            : "Your responses indicate significant anxiety. We recommend speaking with a mental health professional.";
  } else {
    severity = getPHQ9Severity(total_score);
    message =
      severity === "minimal"
        ? "Your mood appears to be in a good range. Keep up the habits that support your mental wellness."
        : severity === "mild"
          ? "You may be experiencing some low mood. Self-care and support from friends or family can help."
          : severity === "moderate"
            ? "Your responses suggest moderate depression symptoms. Consider talking to a counselor or doctor."
            : severity === "moderately_severe"
              ? "Your responses indicate significant depression. Professional support is recommended."
              : "Your responses suggest severe depression. We strongly recommend reaching out to a mental health professional or your doctor.";
  }

  res.status(200).json({
    total_score,
    severity,
    message,
    next_step_url: (severity === "moderate" || severity === "moderately_severe" || severity === "severe")
      ? "/appointment"
      : null,
  });
});
