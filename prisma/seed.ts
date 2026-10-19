
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
async function main(){
  const email = process.env.INITIAL_SUPER_ADMIN_EMAIL!
  const pass = process.env.INITIAL_SUPER_ADMIN_PASSWORD!
  const exists = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' }})
  if(exists){ console.log('Super admin exists'); return }
  const hash = await bcrypt.hash(pass, 12)
  await prisma.user.create({ data: { email, name: 'Владелец', passwordHash: hash, role: 'SUPER_ADMIN' }})
  console.log('Created super admin', email)
}
main().finally(()=>prisma.$disconnect())
