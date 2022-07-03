<template>
	<view class="music-head" :style="{color : color}">
		<view v-if="icon" class="music-head-icon" :class="{'music-head-iconblck' : iconblack}">
			<text class="iconfont iconzuojiantou-copy" @tap="handleToBack"></text> | <text class="iconfont iconshouye" @tap="handleToHome"></text>
		</view>
		{{title}}
	</view>
</template>

<script>
	export default {
		name:"musichead",
		data() {
			return {
				
			};
		},
		props:['title','icon','color','iconblack'],
		methods:{
			handleToBack(){
				uni.navigateBack()
			},
			handleToHome(){
				uni.navigateTo({
					url:'/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped> 
.music-head{
	height: 75px;
	width: 100%;
	font-size: 16px;
	line-height:80px ;
	text-align: center;
	color: black;
	position: relative;
}
.music-head-icon{
	position: absolute;
	left: 8px;
	top:26px ;
	width: 90px;
	height: 30px;
	background:rgba(0,0,0,0.4) ;
	color:white ;
	line-height: 31px;
	border-radius:15px ;
	display: flex;
	justify-content:space-evenly ;
}
.music-head-iconblck{
	color: black;
	border: 1px solid #eaeaea;
	background: white;
}
</style>
