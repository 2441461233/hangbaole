const key = 'cybercomrade_requests';

async function getStats() {
  try {
    // 尝试获取旧 API 数据，如果可用则累加
    let oldApiCount = 0;
    try {
      const oldRes = await fetch('https://api.counterapi.dev/v1/cybercomrade/requests/', { signal: AbortSignal.timeout(3000) });
      if (oldRes.ok) {
        const oldData = await oldRes.json();
        oldApiCount = oldData.count || 0;
      }
    } catch (e) {
      // 忽略旧 API 错误，可能还在宕机中
    }

    const res = await fetch(`https://countapi.mileshilliard.com/api/v1/get/${key}`);
    
    if (!res.ok) {
      if (res.status === 404) {
        console.log('\n================================');
        console.log('🤖 赛博战友 - 项目请求量统计 🤖');
        console.log('================================');
        console.log(`🔥 已经被赛博气运折磨了：\x1b[32m${oldApiCount}\x1b[0m 次`);
        console.log('================================\n');
        return;
      }
      throw new Error(`API 返回状态码: ${res.status}`);
    }

    const data = await res.json();
    const totalCount = data.value + oldApiCount;
    
    console.log('\n================================');
    console.log('🤖 赛博战友 - 项目请求量统计 🤖');
    console.log('================================');
    console.log(`🔥 已经被赛博气运折磨了：\x1b[32m${totalCount}\x1b[0m 次`);
    console.log('================================\n');

  } catch (error) {
    console.error('❌ 获取统计失败:', error.message);
  }
}

getStats();
