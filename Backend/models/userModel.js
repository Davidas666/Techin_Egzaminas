const { sql } = require("../dbConnection");


exports.getUserByEmail = async (email) =>{

    const [user] = await sql`
    SELECT * FROM users WHERE users.email = ${email}
    `;
    return user;
};

exports.createUser = async (newUser) =>{
    const [user] = await sql`
    INSERT INTO users  ${sql(newUser, 'username','email','password')}
    RETURNING *
    `;
    return user;
};

exports.getUserById = async (id) => {
    const [user] = await sql`
    SELECT id, username, email, role FROM users WHERE users.id = ${id}
    `;
    return user;
};

exports.getAllUsers = async () => {
    const users = await sql`
        SELECT id, username, email, role FROM users ORDER BY id`;
    return users;
};

exports.deleteUser = async (id) => {
    const [deleted] = await sql`
        DELETE FROM users WHERE id = ${id} RETURNING id`;
    return deleted;
};

exports.updateUserRole = async (id, role) => {
    const [updated] = await sql`
        UPDATE users SET role = ${role} WHERE id = ${id} RETURNING id, username, email, role`;
    return updated;
};