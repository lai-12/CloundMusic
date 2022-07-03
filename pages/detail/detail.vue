<template>
	<view class="detail">
		<!-- 背景 -->
		<view class="fixbd" :style="{'background-image':'url('+ songDetail.al.picUrl +')'}"></view>
		<!-- 标题 -->
		<musichead :title="songDetail.name" :icon="true" color="white"></musichead>
		
		<view class="container"  v-show="!isShow">
			<scroll-view scroll-y="true">
				<!-- 播放图片 -->
				<view class="detail-play" @tap="handleToPlay">
					<image :src="songDetail.al.picUrl" :class="{'detail-play-run' : isPlayRotate}"></image>
					<text class="iconfont" :class="iconPlay"></text>
					<view class="play_bar" :class="{ 'detail-play-run' : isPlayRotate }"></view>
				</view>
				<!-- 歌词部分 -->
				<view class="detail-lyric">
					<view class="detail-lyric-wrap" :style="{transform : 'translateY('+ - (lyricIndex-1)*82 +'rpx)'}">
						
						<view class="detail-lyric-item" :class="{active : lyricIndex == index}" v-for="(item,index) in songLyric" :key="index">{{item.lyric}}</view>
						
					</view>
				</view>
				
				<!-- 相似歌曲部分 -->
				<view class="detail-like">
					<view class="detail-like-head">
						喜欢这首歌的人也喜欢听
					</view>
					<view class="detail-like-item" v-for="(item,index) in songSimi" :key="index" @tap="handleToSimi(item.id)">
						<view class="detail-like-img">
							<image :src="item.album.picUrl"></image>
						</view>
						<view class="detail-like-song">
							<view>{{item.name}}</view>
							<view>
								<image v-if="item.privilege.flag > 60 && item.privilege.flag < 70"
									src="../../static/dujia.png" mode=""></image>
								<image v-if="item.privilege.maxbr == 999000" src="../../static/sq.png"></image>
								{{item.artists[0].name}} - {{item.name}}
							</view>
						</view>
						<text class="iconfont iconbofang"></text>
					</view>
				</view>
				
				<!-- 评论部分 -->
				<view class="detail-comment">
					<view class="detail-comment-head">
						精彩评论
					</view>
					<view class="detail-comment-item" v-for="(item,index) in songComment" :key="index">
						<!-- 左侧图片 -->
						<view class="detail-comment-img">
							<image :src="item.user.avatarUrl"></image>
						</view>
						<!-- 右侧评论内容 -->
						<view class="detail-comment-content">
							<view class="detail-comment-title">
								<view class="detail-comment-name">
									<view>{{item.user.nickname}}</view>
									<view>{{item.time | formatTime}}</view>
								</view>
								<!-- 点赞次数 -->
								<view class="detail-comment-like">{{item.likedCount |formatCount}}<text class="iconfont iconlike"></text></view>
							</view>
							<view class="detail-comment-text">{{item.content}}</view>
						</view>
					</view>
				</view>
				
				<!-- 分享按钮 /条件编译-->
				<!-- #ifdef MP-WEIXIN -->
				<button class="list-share" open-type="share">
					<text class="iconfont iconicon-">分享给微信好友</text>
				</button>
				<!-- #endif -->	
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import musichead from "../../components/musichead/musichead.vue"
	import {songDetail,songSimi,songComment,songLyric,songUrl} from "../../common/api.js"
	export default {
		data() {
			return {
				songDetail:{
					al:{
						picUrl:''
					}
				},
				songSimi:[],
				songComment:[],
				songLyric:[],
				lyricIndex:0,
				 //播放按钮
				iconPlay:'iconpause',
				//是否旋转
				isPlayRotate:true,
				isShow: true
			}
		},
		components:{
			musichead
		},
		// 离开页面时清除时间戳
		onUnload(){
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioManager.destroy();
			// #endif
			
		},
		onHide(){
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioManager.destroy();
			// #endif
		},
		onLoad(options) {
			// console.log(options.songId)
			this.getMusic(options.songId)
		},
		methods: {
			getMusic(songId){
				
				this.$store.commit('NEXT_ID',songId);
				//添加loading效果
				uni.showLoading({
					title:'正在加载'
				})
				this.isShow = true;
				
				Promise.all([songDetail(songId),songSimi(songId), songComment(songId),songLyric(songId),songUrl(songId)]).then((res)=>{
					// console.log(res)
					if(res[0][1].data.code==200){
						this.songDetail = res[0][1].data.songs[0];
					}
					if(res[1][1].data.code==200){
						this.songSimi = res[1][1].data.songs;
						// console.log(res)
					}
					if(res[2][1].data.code==200){
						// console.log(res)
						this.songComment = res[2][1].data.hotComments
					}
					if(res[3][1].data.code==200){
						console.log(res)
						let lyric =res[3][1].data.lrc.lyric;
						// console.log(lyric)
						let re = /\[([^\]]+)\]([^\[]+)/g;
						var result = [];
						lyric.replace(re, ($0,$1,$2)=>{
							result.push({"time" : this.formatTimeToSec($1) , "lyric" : $2});
						});
						this.songLyric = result;
					}
					if(res[4][1].data.code==200){
						
						// #ifdef MP-WEIXIN
						this.bgAudioManager = uni.getBackgroundAudioManager();
						this.bgAudioManager.title = this.songDetail.name;
						// #endif
						
						
						// #ifdef H5
						if(!this.bgAudioManager){
							this.bgAudioManager = uni.createInnerAudioContext()
						}
						
						this.iconPlay = 'iconbofang1';
						this.isPlayRotate = false;
						// #endif
						
						
						
						this.bgAudioManager.src =res[4][1].data.data[0].url || '';
						this.listenLyricIndex()
						//监听歌曲播放
						this.bgAudioManager.onPlay(()=>{
							this.iconPlay = 'iconpause';
							this.isPlayRotate = true;
							this.listenLyricIndex()
						});
						//监听歌曲暂停
						this.bgAudioManager.onPause(()=>{
							this.iconPlay = 'iconbofang1';
							this.isPlayRotate = false;
							this.cancelLyricIndex();
						});
						// 监听歌曲播放结束
						this.bgAudioManager.onEnded(()=>{
							this.getMusic(this.$store.state.nextId);
						});
					}
					//隐藏loading效果
					this.isShow =false;
					uni.hideLoading();
				});
			},
			// 歌词时间格式化方法
			formatTimeToSec(value){
				let arr = value.split(':')
				return (Number(arr[0]*60) + Number(arr[1])).toFixed(1);
			},
			// 点击播放暂停
			handleToPlay(){
				if(this.bgAudioManager.paused){
					this.bgAudioManager.play();
				}else{
					this.bgAudioManager.pause();
				}
			},
			// 歌词监听
			listenLyricIndex(){
				clearInterval(this.timer)
				this.timer = setInterval(()=>{
					
					for( var i =0; i<this.songLyric.length;i++){
						// 判断歌词是否为最后一条
						if(this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length-1].time){
							this.lyricIndex = songLyric.length-1;
							break;
						}
						//根据上下两条数据确定当前歌词
						if(this.bgAudioManager.currentTime > this.songLyric[i].time && this.bgAudioManager.currentTime < this.songLyric[i+1].time){
							this.lyricIndex =i ;
						}
					}
					
				},500)
			},
			//清除时间戳方法
			cancelLyricIndex(){
				clearInterval(this.timer)
			},
			//点击相似歌曲回调
			handleToSimi(songId){
				this.getMusic(songId);
			}
		}
	}
</script>

<style scoped>
.detail-play{
	width: 580rpx;
	height: 580rpx;
	background: url(~@/static/disc.png);
	background-size: cover;
	margin: 214rpx auto 0 auto;
	position: relative;
}
.detail-play image{
	width: 370rpx;
	height: 370rpx;
	border-radius: 50%;
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	margin:auto;
	animation: 10s linear move infinite;
	animation-play-state:paused ;
}
.detail-play text{
	width: 100rpx;
	height: 100rpx;
	font-size: 100rpx;
	color: white;
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	margin:auto;
}
/* 转盘停止 和 播放杆 转回去 */
.detail-play .detail-play-run{
	animation-play-state: running;
	 transform: rotate(0)
}
@keyframes move{
	from{transform: rotate(0deg);}
	to{transform: rotate(360deg);}
}

.detail-play view{ 
	position: absolute;
	width:170rpx;
	height:266rpx; 
	position: absolute; 
	left:60rpx; 
	right:0;  
	margin:auto; 
	top:-170rpx; 
	background:url(~@/static/needle.png); 
	background-size:cover;
	animation-name: Rotate;
    animation-iteration-count: infinite;
    animation-play-state: paused;
    animation-timing-function: linear;
	animation-duration: 1s;
	
}
/* 杆子旋转 */
.play_bar {
	  position: absolute;
	  left: 200px;
	  top: -10px;
	  z-index: 10;
	  transform: rotate(-25deg);
	  transform-origin: 12px 12px;
	  transition: 1s;
	}

.list-share{
	width: 330rpx;
	height: 74rpx;
	margin: 0 auto;
	background:rgba(0,0,0,0.4) ;
	border-radius: 37rpx;
	color: white;
	text-align: center;
	line-height: 74rpx;
	font-size: 28rpx;
}

.detail-lyric{
	font-size: 32rpx;
	line-height: 82rpx;
	height: 246rpx;
	text-align: center;
	overflow: hidden;
	color: #676e73;
}
.detail-lyric-wrap{
	transition: .5s;
}
.detail-lyric-item{
	height: 82rpx;
	
}
.detail-lyric-item.active{
	color: white;
}
.detail-like{
	margin: 0 30rpx;
}
.detail-like-head{
	font-size: 36rpx;
	color: white;
	margin: 50rpx 0;
}
.detail-like-img{
	width: 82rpx;
	height: 82rpx;
	border-radius: 20rpx;
	overflow: hidden;
	margin-right: 20rpx;
}
.detail-like-img image{
	width: 100%;
	height: 100%;
}
.detail-like-item{
	display: flex;
	align-items: center;
	margin-bottom: 28rpx;
}
.detail-like-song{
	flex: 1;
	color: #c6c2bf;
}
.detail-like-song view:nth-child(1){
	font-size: 28rpx;
	color: white;
	margin-bottom: 12rpx;
}
.detail-like-song view:nth-child(2){
	font-size: 22rpx;
	color: #c6c2bf; 
}
.detail-like-song image{
	width: 26rpx;
	height: 20rpx;
	margin-right:10rpx;
}
.detail-like-item text{
	font-size: 50rpx;
	color:#877764;
}
.detail-comment{
	margin: 0 30rpx;
	
}
.detail-comment-head{
	font-size: 36rpx;
	color: white;
	margin: 50rpx 0;
}
.detail-comment-item{
	display: flex;
	margin-bottom: 28rpx;
}
.detail-comment-img{
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-right: 18rpx;
}
.detail-comment-img image{
	width: 100%;
	height: 100%;
}
.detail-comment-content{
	flex: 1;
	color: #cbcacf;
}
.detail-comment-title{
	display: flex;
	justify-content: space-between;
}
.detail-comment-name{
	
}
.detail-comment-name view:nth-child(1){
	font-size: 26rpx;
}
.detail-comment-name view:nth-child(2){
	font-size: 20rpx;
}
.detail-comment-like{
	font-size: 28rpx;
}
.detail-comment-text{
	line-height: 40rpx;
	font-size: 28rpx;
	color: white;
	margin-top: 18rpx;
	border-bottom: 1px solid #e0e0e0;
	padding-bottom: 40rpx;
}
</style>
