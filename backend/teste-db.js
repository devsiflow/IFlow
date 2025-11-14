import prisma from './src/lib/prismaClient.js';

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco...');
    
    // Teste simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Conexão com o banco OK:', result);
    
    // Teste contagem de itens
    const itemCount = await prisma.item.count();
    console.log(`📦 Total de itens no banco: ${itemCount}`);
    
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão com o banco:', error.message);
    return false;
  }
}

testConnection();