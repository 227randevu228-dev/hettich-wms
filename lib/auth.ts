
import bcrypt from 'bcryptjs'
export function requireRole(session: any, roles: string[]){
  if(!session?.user) throw new Error('UNAUTHORIZED')
  if(!roles.includes(session.user.role)) throw new Error('FORBIDDEN')
}
export async function hashPassword(p:string){ return bcrypt.hash(p,12) }
export async function verifyPassword(p:string, hash:string){ return bcrypt.compare(p,hash) }
