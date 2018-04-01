<template>
  <scroll ref="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
// import Scroll from 'base/scroll/scroll'
// import Loading from 'base/loading/loading'
// import NoResult from 'base/no-result/no-result'
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {filterSinger} from 'common/js/song'
// import {createSong} from 'common/js/song'
// import {mapMutations, mapActions} from 'vuex'
// import Singer from 'common/js/singer'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  data() {
    return {
      page: 1,
      result: []
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSonger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    search() {
      search(this.query, this.page, this.showSonger).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
        }
      })
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.songname}-${filterSinger(item.singer)}`
      }
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singer) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(data.song.list)
      }
      return ret
    }
  },
  watch: {
    query() {
      this.search()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>