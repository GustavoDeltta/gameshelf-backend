class User {
  constructor(
    uid,
    email,
    username,
    steamId = null,
    steamProfilePicture = null,
    ownedGames = []
  ) {
    this.uid = uid;
    this.email = email;
    this.username = username;
    this.steamId = steamId;
    this.steamProfilePicture = steamProfilePicture;
    this.ownedGames = ownedGames;
    this.createdAt = new Date().toISOString();
    this.role = "user";
  }

  toFirestore() {
    return {
      email: this.email,
      username: this.username,
      steamId: this.steamId,
      steamProfilePicture: this.steamProfilePicture,
      ownedGames: this.ownedGames,
      createdAt: this.createdAt,
      role: this.role,
    };
  }

  static fromFirestore(uid, data) {
    const user = new User(
      uid,
      data.email,
      data.username,
      data.steamId,
      data.steamProfilePicture,
      data.ownedGames
    );
    user.role = data.role;
    user.createdAt = data.createdAt;
    return user;
  }
}

module.exports = User;
