const globalStore = globalThis;

if (!globalStore.__pomoUsers) {
  globalStore.__pomoUsers = [];
}

export function getUsers() {
  return globalStore.__pomoUsers;
}

export function addUser(user) {
  globalStore.__pomoUsers.push(user);
  return user;
}

export function findUserByEmail(email) {
  return globalStore.__pomoUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function findUserByUsername(username) {
  return globalStore.__pomoUsers.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
}
