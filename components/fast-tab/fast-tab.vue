<template>
	<scroll-view class="fast-tab"
		:style="{
			'height':!isNaN(height) ? height + 'rpx' : height,
		  'width':'100%'
		}" 	
		:scroll-x = "!flex"
		:scroll-left="scrollLeft"
		@scroll="scrollMove"
		scroll-with-animation
	>
		<view class="tabBox"
		  :class="{'flex':flex}"
			:style="{
				'height':!isNaN(height) ? height + 'rpx' : height
			}" 
		>
			<view class="tabItem" :id="'tab'+ genId" :class="'tab'+genId+key"
				v-for="(item,key) in list"
				:key="key"
				:style="{
					'height':!isNaN(height) ? height + 'rpx' : height,
					'color':activeIndex === key ? activeColor : color,
					'font-size':!isNaN(size) ? size + 'rpx' : size,
					'font-weight':activeIndex === key && bold ? 'bold' : '400',
					'padding':!isNaN(padding) ? padding + 'rpx' : padding,
					'top':!isNaN(top) ? top + 'rpx' : top,
				}" 
				@tap="trigger(key,item)"
			>
				<text :style="{
					'transform':activeIndex === key ? `scale(${scale})` : `scale(1)`
				}
				">{{item[label]}}</text>
			</view>
			<view class="line" :id="'line'+genId" v-if="totalWidth >= 0" :style="{'bottom':!isNaN(lineBottom) ? lineBottom + 'rpx' : lineBottom,'left':totalWidth+'px'}">
				<slot>
					<text
					:style="{
						'display':'inline-block',
						'width':!isNaN(lineWidth) ? lineWidth + 'rpx' : lineWidth,
						'height':!isNaN(lineHeight) ? lineHeight + 'rpx' : lineHeight,
					  'border-radius':!isNaN(lineRadius) ? lineRadius + 'rpx' : lineRadius,
						'background':activeColor,
					}" 
					></text>
				</slot>
			</view>
		</view>
	</scroll-view>
</template>

<script>
  export default {
    name: 'fast-tab',
    components:{},
    props:{
      /** tab数据 **/
			list:{
				type:Array,
				default(){
					return []
				}
			},
			/** 激活项的索引 **/
			activeIndex:{
				type:Number,
				default:0
			},
			/** label字段 **/
			label:{
				type:String,
				default:"searchKeywords"
			},
			/** 左右间距 **/
			padding:{
				type:[Number,String],
				default:18
			},
			/** 文本偏移 **/
			top:{
				type:[Number,String],
				default:-10
			},
			/** 组件高度 **/
			height:{
				type:[Number,String],
				default:45
			},
			/** 默认颜色 **/
			color:{
				type:String,
				default:'#333'
			},
			/** 激活颜色 **/
			activeColor:{
				type:String,
				default:'#3B00FF'
			},
			/** 激活后的缩放倍数 **/
			scale:{
				type:Number,
				default:1
			},
			/** flex全铺布局 **/
			flex:Boolean,
			/** 字号 **/
			size:{
				type:[Number,String],
				default:28
			},
			/** 字号加粗 **/
			bold:Boolean,
			/** 激活线的宽度 **/
			lineWidth:{
				type:[Number,String],
				default:52
			},
			/** 激活线的高度 **/
			lineHeight:{
				type:[Number,String],
				default:6
			},
			/** 激活线的圆角 **/
			lineRadius:{
				type:[Number,String],
				default:6
			},
			/** 激活线距离底部的距离 **/
			lineBottom:{
				type:[Number,String],
				default:-10
			}
    },
    data () {
      return {
				scrollLeft:0,
				tabWidthList:[],
				totalWidth:-1,
				moveParams: {
					scrollLeft: 0
				},
				genId:Number(Math.random().toString().substr(3,10) + Date.now()).toString(36)
      }
    },
    methods:{
			unitInterTrans(...params){
				let _number = parseFloat(params[0]);
				if(params[1] === 'rpx'){
					return _number * 750 / uni.getSystemInfoSync().windowWidth;
				}
				if(params[1] === 'px'){
					return _number / 750 * uni.getSystemInfoSync().windowWidth;
				}
			},
			getRect(ele) {
				let that = this;
				uni.createSelectorQuery().in(this).select(ele).boundingClientRect(function (rect) {
					that.moveParams.subLeft = rect.left;
					that.moveParams.subHalfWeight = rect.width / 2;
					that.moveParams.screenHalfWeight = uni.getSystemInfoSync().windowWidth / 2;
					that.moveTo();
				}).exec()
			},
			moveTo(){
				let subLeft = this.moveParams.subLeft;
				let screenHalfWeight = this.moveParams.screenHalfWeight;
				let subHalfWeight = this.moveParams.subHalfWeight;
				let scrollLeft = this.moveParams.scrollLeft;
				let distance = subLeft - screenHalfWeight + subHalfWeight;
				this.scrollLeft = scrollLeft + distance;
			},
			scrollMove(e) {
				this.moveParams.scrollLeft = e.detail.scrollLeft;
			},
			toItem(){
				this.getRect('.tab'+this.genId+this.activeIndex);
				this.totalWidth = this.tabWidthList.slice(0,this.activeIndex).reduce((prev,item)=>{
					return prev + item;
				},0);
				this.totalWidth = this.totalWidth + ((this.tabWidthList[this.activeIndex] - this.unitInterTrans(this.lineWidth,'px')) / 2);
			},
			trigger(key,item){
				this.$emit('update:activeIndex',key);
				this.$emit('on-change',key,item);
			}
    },
    computed:{

    },
    filters:{

    },
    watch:{
			activeIndex(){
				this.toItem();
			}
    },
    created(){
      
    },
    mounted(){
			let that = this;
			uni.createSelectorQuery().in(this).selectAll('#tab'+this.genId).boundingClientRect(function (rect) {
				that.tabWidthList = rect.reduce((prev,item)=>{
					return [...prev,...[item.width]];
				},[])
				that.toItem();
			}).exec()
    },
    activated(){
			
    }
  }
</script>

<style scoped lang="scss">
  .fast-tab{
		box-sizing: border-box;
		.tabBox{
			white-space: nowrap;
			position: relative;
			&.flex{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.tabItem{
					flex: 1;
				}
			}
			.tabItem{
				position: relative;
				display: inline-flex;
				white-space: nowrap;
				align-items: center;
				transition: all 0.2s;
				justify-content: center;
				padding-top: 0rpx !important;
				padding-bottom: 0rpx !important;
				text,view{
					transition: all 0.2s;
				}
			}
			.line{
				transition: all 0.2s;
				position: absolute;
				z-index: 55;
			}
		}
  }
</style>