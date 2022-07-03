<template>
	<view class="index">
		<!-- 标题 -->
		<musichead title="网易云音乐" :icon="false"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
				<!-- 搜索框 -->
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont iconsearch">
					</text><input type="text" placeholder="搜索歌曲"/>
				</view>
				
				<!-- 骨架屏 -->
				<view v-if="isLoading"> 
				<m-for-skeleton
				        :avatarSize="200"
				        :row="3"
				        :loading="isLoading"
				        isarc="square"
				        v-for="(item,key) in 4"
						:titleStyle="{}"
						:title="false"
				        :key="key">
				  </m-for-skeleton>
				  </view>
				
				<!-- 音乐列表 -->
				<view class="index-list" v-else>
					<!-- 左侧图片 -->
					<view class="index-list-item" v-for="(item,index) in topList" :key="index" @tap="handleToList" :data-id="item.id"> 
						<view class="index-list-img">
							<image :src="item.coverImgUrl"></image>
							<text>{{item.updateFrequency}}</text>
						</view>
						<!-- 右侧列表文字 -->
						<view class="index-list-text">
							<view v-for="(item,index) in item.tracks" :key="index">{{index+1}}.{{item.first}} - {{item.second}}</view>
							
						</view>
					</view>
	
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import musichead from "../../components/musichead/musichead.vue"
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton";
	import {topList} from "../../common/api.js"
	export default {
		data() {
			return {
				title: 'Hello',
				topList:[],
				isLoading:true
			}
		},
		components:{
			musichead,
			mForSkeleton
		},
		onLoad() {
			//获取榜单信息
			topList().then((res)=>{
				console.log(res)
				if(res.length){
					//模拟loading效果
					setTimeout(()=>{
						this.topList = res;
						this.isLoading = false
					},500);
					
				}
			})
		},
		methods: {
			// 跳转到歌单列表页
			handleToList(event){
				uni.navigateTo({
					url:'../list/list?listId=' + event.currentTarget.dataset.id
				})
			},
			// 跳转到搜索
			handleToSearch(){
				uni.navigateTo({
					url:'../search/search'
				})
			}
		}
	}
</script>

<style scoped>
	.index-search text{
		font-size: 26rpx;
		margin-right: 26rpx;
		margin-left: 28rpx;
	}
	.index-search{
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background: #f7f7f7;
		border-radius:50rpx ;
	}
	.index-search input{
		font-size: 28rpx;
		flex: 1;
	}
	.index-list{
		margin: 0 30rpx;
	}
	.index-list-item{
		display: flex;
		margin-bottom: 34rpx;
	}
	.index-list-img{
		width: 212rpx;
		height: 212rpx;
		position: relative;
		border-radius: 30rpx;
		overflow: hidden;
		margin-right: 20rpx;
		
	}
	.index-list-img image{
		width: 100%;
		height: 100%;
		
	}
	.index-list-img text{
		position: absolute;
		left: 12rpx;
		bottom: 16rpx;
		color: white;
		font-size: 20rpx;
		
	}
	.index-list-text{
		flex:1;
		line-height: 66rpx;
		font-size: 24rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
