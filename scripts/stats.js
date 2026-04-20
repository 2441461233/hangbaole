const key = 'cybercomrade_requests';

async function getStats() {
  try {
    const res = await fetch(`https://countapi.mileshilliard.com/api/v1/get/${key}`);
    
    if (!res.ok) {
      if (res.status === 404) {
        console.log('\n================================');
        console.log('🤖 赛博战友 - 项目请求量统计 🤖');
        console.log('================================');
        console.log('🔥 还没人被气到发疯，当前请求：0 次');
        console.log('================================\n');
        return;
      }
      throw new Error(`API 返回状态码: ${res.status}`);
    }

    const data = await res.json();
    console.log('\n================================');
    console.log('🤖 赛博战友 - 项目请求量统计 🤖');
    console.log('================================');
    console.log(`🔥 已经被赛博气运折磨了：\x1b[32m${data.value}\x1b[0m 次`);
    console.log('================================\n');

  } catch (error) {
    console.error('❌ 获取统计失败:', error.message);
  }
}

getStats();
