import { useEffect, useState } from "react";
import type { InferResponseType } from "hono";
import "./App.css";
import { client } from "./lib/api";

const emojiOptions = ["😄", "🙂", "😔", "😠", "😴"] as const;

type Profile = InferResponseType<typeof client.current.$get, 200>["profile"];
type ErrorResponse = { error: string };
type UpdateMoodSuccessResponse = InferResponseType<typeof client.mood.$patch, 200>;

export default function App() {
  // Defined state variables for profile, mood, moodEmoji, loading, saving, and error
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mood, setMood] = useState("");
  const [moodEmoji, setMoodEmoji] = useState<(typeof emojiOptions)[number]>("😄");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Function to load the user profile from the API
  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const res = await client.current.$get();

      if (!res.ok) {
        const data: ErrorResponse = await res.json();
        setError(data.error);
        return;
      }

      const data = await res.json();
      setProfile(data.profile);
      setMood(data.profile.mood ?? "");
      setMoodEmoji((data.profile.moodEmoji ?? "😄") as (typeof emojiOptions)[number]);
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  // Function to handle saving the updated mood to the API
  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      const res = await client.mood.$patch({
        json: {
          mood,
          moodEmoji,
        },
      });

      if (!res.ok) {
        const data: ErrorResponse = await res.json();
        setError(data.error);
        return;
      }

      const data: UpdateMoodSuccessResponse = await res.json();
      setProfile(data.profile);
    } catch {
      setError("Failed to update mood");
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
        {/* <h1 className="title">User Profile</h1> */}
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

          {error ? <p className="error">{error}</p> : null}
        </div>
      </section>
    </main>

    /*
    <main className="page">
      <section className="card">
        <h1 className="title">User Profile</h1>

        {loading ? (
          <p>Loading profile...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : profile ? (
          <>
            <div className="section">
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Bio:</strong> {profile.bio ?? "No bio yet"}</p>
              <p>
                <strong>Current mood:</strong> {profile.moodEmoji ?? "—"} {profile.mood ?? "No mood set"}
              </p>
            </div>

            <div className="section">
              <label htmlFor="mood" className="label">
                Update mood:
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
            </div>

            <div className="section">
              <p className="label">Choose emoji</p>
              <div className="emoji-row">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setMoodEmoji(emoji)}
                    className={moodEmoji === emoji ? "emoji-button selected" : "emoji-button"}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="save-button"
            >
              {saving ? "Saving..." : "Save mood"}
            </button>
          </>
        ) : (
          <p>No profile found.</p>
        )}
      </section>
    </main>
    */
  );
}