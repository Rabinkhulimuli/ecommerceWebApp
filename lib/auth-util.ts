import bcryptjs from "bcryptjs"
export async function hashPassword(password:string):Promise<string>{
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password,salt)
}