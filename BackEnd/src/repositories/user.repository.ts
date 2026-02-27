import { pool } from '../config/database';
import { User, RegisterDTO, UpdateProfileDTO } from '../models/user.model';

export class UserRepository {

    async findById(id: number): Promise<User | null> {
        const result = await pool.query<User>(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query<User>(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    }

    async create(data: { name: string; email: string; hashedPassword: string }): Promise<User> {
        const { name, email, hashedPassword } = data;

        const result = await pool.query<User>(
            `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING *`,
            [name, email, hashedPassword]
        );

        return result.rows[0];
    }

    async update(id: number, data: UpdateProfileDTO): Promise<User | null> {
        const result = await pool.query<User>(
            `UPDATE users
       SET name = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
            [data.name, id]
        );
        return result.rows[0] || null;
    }

    async findAll(
        limit = 20,
        offset = 0,
        search = ''
    ): Promise<{ users: User[]; total: number }> {
        const searchParam = `%${search}%`;

        const [usersResult, countResult] = await Promise.all([
            pool.query<User>(
                `SELECT * FROM users
         WHERE name ILIKE $1 OR email ILIKE $2
         ORDER BY created_at DESC
         LIMIT $3 OFFSET $4`,
                [searchParam, searchParam, limit, offset]
            ),
            pool.query<{ count: string }>(
                `SELECT COUNT(*) as count FROM users
         WHERE name ILIKE $1 OR email ILIKE $2`,
                [searchParam, searchParam]
            ),
        ]);

        return {
            users: usersResult.rows,
            total: parseInt(countResult.rows[0].count, 10),
        };
    }

}

export const userRepository = new UserRepository();