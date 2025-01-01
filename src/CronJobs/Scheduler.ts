import cron from 'node-cron'
import { AppDataSource } from '../Utils/Database'
import { User } from '../Entities/User'

export const Scheduler = () => {
    return cron.schedule('* */24 * * *', async () => {
        try {
            console.log('Running scheduler...')

            if (!AppDataSource.isInitialized) {
                console.log('Database not yet initialized. Skipping this run.')
                return
            }

            const userRepository = AppDataSource.getRepository(User)

            // Find all users
            const users = await userRepository.find()
            console.log(`Found ${users.length} total users.`)

            // Find and remove unverified users
            const result = await userRepository.createQueryBuilder()
                .delete()
                .from(User)
                .where("isVerified = :status", { status: false })
                .execute()

            console.log(`Removed ${result.affected} unverified users.`)

            // Find remaining users after removal
            const remainingUsers = await userRepository.find()

            if (remainingUsers.length > 0) {
                console.log(`Remaining users: ${remainingUsers.length}`)
            } else {
                console.log("No users remaining in the database.")
            }

            return remainingUsers
        } catch (error) {
            console.error("Error in scheduler:")
            if (error instanceof Error) {
                console.error("Error name:", error.name)
                console.error("Error message:", error.message)
                console.error("Error stack:", error.stack)
            } else {
                console.error("Unexpected error:", error)
            }
        }
    })
}

