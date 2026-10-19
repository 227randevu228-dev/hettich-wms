
import { prisma } from './prisma'
// Атомарная операция: приход/расход
export async function executeStockOperation(input: any){
  return await prisma.$transaction(async (tx)=>{
    const product = await tx.product.findUnique({ where: { id: input.productId }})
    if(!product) throw new Error('PRODUCT_NOT_FOUND')
    if(product.status==='ARCHIVED') throw new Error('PRODUCT_ARCHIVED')
    let delta = 0
    if(input.type==='INBOUND' || input.type==='RETURN_FROM_CUSTOMER') delta = input.quantity
    else if(['OUTBOUND_SALE','OUTBOUND_ISSUE','OUTBOUND_WRITEOFF','RETURN_TO_SUPPLIER'].includes(input.type)) delta = -input.quantity
    else if(input.type==='ADJUSTMENT') delta = input.quantity - product.currentStock
    const newBalance = product.currentStock + delta
    const settings = await tx.systemSettings.findUnique({ where: { id: 'singleton' }})
    if(newBalance < 0 && !settings?.allowNegativeStock) throw new Error('INSUFFICIENT_STOCK')
    const op = await tx.stockOperation.create({ data: {...input, quantity: Math.abs(input.quantity), resultingStock: newBalance} })
    await tx.stockLedger.create({ data: { productId: product.id, delta, balanceAfter: newBalance, operationId: op.id }})
    await tx.product.update({ where: { id: product.id }, data: { currentStock: newBalance }})
    await tx.auditLog.create({ data: { userId: input.userId, action: input.type, entityType:'Product', entityId: product.id, afterJson: { delta, newBalance } }})
    return op
  }, { isolationLevel: 'Serializable' })
}
