import { useEffect, useState } from "react";
import "./App.css";
import {
  getCurrentProfile,
  getMoodHistory,
  updateMood,
  type Profile,
  type MoodHistoryEntry,
} from "./lib/api";

const emojiOptions = ["😄", "🙂", "😔", "😠", "😴"] as const;

export default function App() {
  // Defined state variables for profile, mood, moodEmoji, loading, saving, and error
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mood, setMood] = useState("");
  const [moodEmoji, setMoodEmoji] = useState<(typeof emojiOptions)[number]>("😄");
  const [history, setHistory] = useState<MoodHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Function to load the user profile from the API
  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const data = await getCurrentProfile();

      setProfile(data.profile);
      setMood(data.profile.mood ?? "");
      setMoodEmoji((data.profile.moodEmoji ?? "😄") as (typeof emojiOptions)[number]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  // Function to load the user's mood history from the API
  async function loadHistory() {
    setLoading(true);
    setError("");
    
    try {
      const data = await getMoodHistory();
      
      setHistory(data.history);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load mood history");
    } finally {
      setLoading(false);
    }
  }

  // Function to handle saving the updated mood to the API 
  // and loading new profile and mood history data
  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await updateMood({ mood, moodEmoji });
      await Promise.all([loadProfile(), loadHistory()]);

      setSuccessMessage("Mood updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update mood");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) {
    return (
      <main className="page">
        <section className="card">
          <p className="status-text">Loading profile...</p>
        </section>
      </main>
    );
  }

  // Helper function to format the updatedAt date for display
  function formatUpdatedAt(updatedAt: string | null) {
    if (!updatedAt) return "Not updated yet";

    return new Date(updatedAt).toLocaleString();
  }

  // Render the profile information, mood update form, mood history list, and handle loading/error states
  return (
    <main className="page">
      <section className="card">
        <div className="profile-header">
          <div className="profile-emoji">
            {profile?.moodEmoji || "🙂"}
          </div>

          <h1 className="username">
            {profile?.username}
          </h1>

          <p className="bio">
            {profile?.bio || "No bio yet"}
          </p>

          <div className="mood-badge">
            <span className="mood-badge-label">Current Mood</span>
            <span>
            {profile?.mood ?? "No mood set"}
            </span>
          </div>
        </div>

        <div className="divider" />

        <div className="form-section">
          <label htmlFor="mood" className="label">
            Update Mood
          </label>

          <input
            id="mood"
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="How are you feeling?"
            maxLength={50}
            className="input"
          />

          <p className="label">Choose an emoji</p>

          <div className="emoji-grid">
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={moodEmoji === emoji 
                  ? "emoji-button emoji-button-selected" 
                  : "emoji-button"}
                onClick={() => setMoodEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="history-section">
            <h2 className="history-title">Recent Mood History</h2>
            
            {history.length === 0 ? (
              <p className="status-text">No history yet</p>
            ) : (
              history.map((entry) => (
                <div key={entry.id} className="history-item">
                  <div className="history-main">
                    <span>{entry.moodEmoji}</span>
                    <span>{entry.mood}</span>
                  </div>

                  <span className="history-time">
                    {formatUpdatedAt(entry.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>

          <p className="updated-at">
            Last updated: {formatUpdatedAt(profile?.updatedAt ?? null)}
          </p>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="save-button"
          >
            {saving ? "Saving..." : "Save mood"}
          </button>

          {error ? <p className="error-text">{error}</p> : null}
          {successMessage ? <p className="success-text">{successMessage}</p> : null}
        </div>
      </section>
    </main>
  );
}