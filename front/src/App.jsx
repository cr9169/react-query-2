import "./App.css";
import React, { useRef } from "react";
import UsersService from "./utils/services/users.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function App() {
  const nameRef = useRef();
  const ageRef = useRef();
  const idRef = useRef();

  const queryClient = useQueryClient();

  const {
    data: users,
    error,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["users"],
    queryFn: UsersService.getAllUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: UsersService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: UsersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    createUserMutation.mutate({
      id: !users ? 1 : users.length + 1,
      name: nameRef.current.value,
      age: ageRef.current.value,
    });
  };

  const handleDeleteUser = (e) => {
    e.preventDefault();
    const id = idRef.current.value;
    deleteUserMutation.mutate(id);
  };

  return (
    <div className="main-app-container">
      <form onSubmit={handleCreateUser} className="create-user-form">
        <section className="inputs-section">
          <div className="input-field">
            <label>Name:</label>
            <input ref={nameRef} type="text" required />
          </div>
          <div className="input-field">
            <label>Age:</label>
            <input
              ref={ageRef}
              type="number"
              max="999"
              onInput={(e) => {
                if (e.target.value.length > 3)
                  e.target.value = e.target.value.slice(0, 3);
              }}
              required
            />
          </div>
        </section>
        <button
          type="submit"
          className="create-button"
          disabled={createUserMutation.isLoading}
        >
          {createUserMutation.isLoading ? "Creating..." : "Create User"}
        </button>
        {createUserMutation.isError && (
          <p>Error creating user: {createUserMutation.error.message}</p>
        )}
        {createUserMutation.isSuccess && <p>User created successfully!</p>}
      </form>

      <form onSubmit={handleDeleteUser} className="delete-user-form">
        <section className="inputs-section">
          <div className="input-field">
            <label>ID:</label>
            <input ref={idRef} type="number" required />
          </div>
        </section>
        <button
          type="submit"
          className="delete-button"
          disabled={deleteUserMutation.isLoading}
        >
          {deleteUserMutation.isLoading ? "Deleting..." : "Delete User"}
        </button>
        {deleteUserMutation.isError && (
          <p>Error deleting user: {deleteUserMutation.error.message}</p>
        )}
        {deleteUserMutation.isSuccess && <p>User deleted successfully!</p>}
      </form>

      <section className="users-section">
        {isLoading ? (
          <div>Loading users...</div>
        ) : isError ? (
          <div>Error fetching users: {error.message}</div>
        ) : isFetching ? (
          <div>Refreshing users list...</div>
        ) : (
          users.map((user, userIndex) => (
            <section key={userIndex} className="user-data">
              {Object.keys(user)
                .filter((key) => key !== "_id" && key !== "createdAt")
                .map((userKey, keyIndex) => (
                  <p key={keyIndex}>{`${userKey}: ${user[userKey]}`}</p>
                ))}
            </section>
          ))
        )}
      </section>
    </div>
  );
}

export default App;
