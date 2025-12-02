const { db } = require("../../../core/config/firebase");
const User = require("../models/User");

class UserRepository {
  async save(userInstance) {
    if (!(userInstance instanceof User)) {
      throw new Error("O dado fornecido não é uma instância de User");
    }
    await db
      .collection("users")
      .doc(userInstance.uid)
      .set(userInstance.toFirestore());
    return userInstance;
  }

  async findByUid(uid) {
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return null;
    }
    return User.fromFirestore(userDoc.id, userDoc.data());
  }

  async update(uid, data) {
    await db.collection("users").doc(uid).update(data);
  }
}

module.exports = new UserRepository();
