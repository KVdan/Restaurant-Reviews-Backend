let users;

export default class UsersDAO {
    static async injectDB(conn) {
        if (users) {
            return;
        }
        try {
            users = await conn.db(process.env.RESTREVIEWS_NS).collection("uers");
        } catch (e) {
            console.error(`Unable to establish collection handles in userDAO: ${e}`);
        }
    }

    static async addUser(user) {
        try {
            let result = await users.insertOne(user);
            return result;
        } catch (e) {
            console.error(`Unable to add new user: ${e}`);
            return { error: e };
        }
    }

    static async isUser(user) {
        try {
            const presentUser = await users.findOne({ email: user.email });
            return presentUser;
        } catch (e) {
            console.error(`No user found: ${e}`);
            return { error: e };
        }
    }
}