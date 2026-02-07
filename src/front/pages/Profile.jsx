import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

export const Profile = () => {
  const { store, dispatch } = useGlobalReducer();

  const [name, setName] = React.useState("");
  const [bio, setBio] = React.useState("");

  
  React.useEffect(() => {
    if (store.user) {
      setName(store.user.name || "");
      setBio(store.user.bio || "");
    }
  }, [store.user]);

  const saveProfile = () => {
    dispatch({ type: "update_user", payload: { name, bio } });
    alert("Profile updated!");
  };

  // Not logged in
  if (!store.user) {
    return (
      <div className="container mt-5 text-center">
        <h2>You are not logged in</h2>
        <p>Please log in to see your profile</p>
        <Link to="/login" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  // Logged in
  return (
    <div className="container mt-5">
      <h2>My Profile</h2>

      <img
        src={store.user.avatar_url || "https://via.placeholder.com/150"}
        width="150"
        className="rounded-circle"
        alt="User avatar"
      />

      <p><strong>Name:</strong> {store.user?.name || "User"}</p>
      <p><strong>Bio:</strong> {store.user?.bio || "No bio yet"}</p>

      <hr />

      <div className="mt-4" style={{ maxWidth: 500 }}>
        <label className="form-label">Name</label>
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="form-label mt-3">Bio</label>
        <textarea
          className="form-control"
          rows="3"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button className="btn btn-primary mt-3" onClick={saveProfile}>
          Save
        </button>
      </div>
    </div>
  );
};
