import { baseUrl } from './config.js';
/**
 * 歌曲榜单
 */
export function topList(){
	// 只需要前四个榜单
	var listIds = ['3' , '0' , '2' , '1' ];
	return new Promise(function(resolve,reject){
		uni.request({
			url: 'http://localhost:3000/toplist/detail',
			method: 'GET',
			data: {},
			success: res => {
				console.log(res);
				let result = res.data.list;
				result.length = 4;
				for(let i=0;i<result.length;i++){
					result[i].listId = listIds[i];
				}
				resolve(result);
			},
			fail: (err) => {
				console.log(err);
			},
			complete: () => {}
		});
	});
	
}

export function list(listId){
	return uni.request({
		url: `${baseUrl}/playlist/detail?id=${listId}`,
		method: 'GET'
	});
}

/**
 * 歌曲详情接口
 */
export function songDetail(songId) {
	return uni.request({
		url: `${baseUrl}/song/detail?ids=${songId}`,
		method: 'GET'
	})
}
/**
 * 播放歌曲接口
 */
export function songUrl(songId) {
	return uni.request({
		url: `${baseUrl}/song/url?id=${songId}`,
		method: 'GET'
	})
}
/**
 * 歌词接口
 */
export function songLyric(songId) {
	return uni.request({
		url: `${baseUrl}/lyric?id=${songId}`,
		method: 'GET'
	})
}
/**
 * 和当前歌曲类似歌曲接口
 * @param {Object} id
 */
export function songSimi(songId) {
	return uni.request({
		url: `${baseUrl}/simi/song?id=${songId}`,
		method: 'GET'
	})
}
/**
 * 评论接口
 */
export function songComment(songId) {
	return uni.request({
		url: `${baseUrl}/comment/music?id=${songId}`,
		method: 'GET'
	})
}

/**
 * 热搜接口
 */
export function searchHot() {
	return uni.request({
		url: `${baseUrl}/search/hot/detail`,
		method: 'GET'
	})
}

/**
 * 热搜词接口
 */
export function searchWord(word) {
	return uni.request({
		url: `${baseUrl}/search?keywords=${word}`,
		method: 'GET'
	})
}

/**
 * 输入提示接口
 */
export function searchSuggest(word) {
	return uni.request({
		url: `${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
		method: 'GET'
	})
}

