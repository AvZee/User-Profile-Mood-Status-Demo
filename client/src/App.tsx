import { useEffect, useState } from "react";
import "./App.css";
import {
  getCurrentProfile,
  updateMood,
  type Profile,
} from "./lib/api";

const emojiOptions = ["😄", "🙂", "😔", "😠", "😴"] as const;

export default function App() {
  // Defined state variables for profile, mood, moodEmoji, loading, saving, and error
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mood, setMood] = useState("");
  const [moodEmoji, setMoodEmoji] = useState<(typeof emojiOptions)[number]>("😄");
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

  // Function to handle saving the updated mood to the API
  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const data = await updateMood({
        mood,
        moodEmoji,
      });

      setProfile(data.profile);
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

  if (loading) {
    return (
      <main className="page">
        <section className="card">
          <p className="status-text">Loading profile...</p>
        </section>
      </main>
    );
  }

  // Render the profile information, mood update form, and handle loading/error states
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