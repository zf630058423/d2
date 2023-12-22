<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)">
      <app-link :to="resolvePath(onlyOneChild.attributes.functionUrl)">
        <el-menu-item :style="getStyle(onlyOneChild)" :index="onlyOneChild.id" :class="{ 'submenu-title-noDropdown': !isNest }" @click="menuClick(item)">
          <item :icon="onlyOneChild.attributes.menuImg" :title="menuLangTitle(onlyOneChild)"/>
        </el-menu-item>
      </app-link>
    </template>
    <!--嵌套自己-->
    <el-submenu v-else ref="subMenu" :index="item.id" popper-append-to-body>
      <template slot="title">
        <item :icon="item.attributes.menuImg" :title="menuLangTitle(item)" />
      </template>
      <sidebar-item v-for="child in item.children" :key="child.id" :is-nest="true" :item="child" :base-path="resolvePath(child.attributes.functionUrl)" class="nest-menu"/>
    </el-submenu>
  </div>
</template>

<script>
// 菜单导航相关背景色，选中色在variables.scss中修改
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  computed: {
    menuLangTitle () {
      return function (item) {
        var language = this.$store.state.app.language
        var enTitle = item.attributes.alias
        if (enTitle == '' || enTitle == null) {
          enTitle = item.title
        }
        var zhTitle = item.title
        return language == 'en-US' ? enTitle : zhTitle
      }
    }
  },
  methods: {
    menuClick (menu) {
      this.$store.dispatch('app/setCurrMenuId', {
        currMenuId: menu.id,
        currMenuTitle: menu.title,
        functionUrl: menu.attributes.functionUrl
      })
    },
    getStyle (item) {
      var style = 'padding-left: 40px;'
      if (item.levelNo != undefined && item.levelNo == 2) {
        style = 'padding-left:20px;'
      } else if (item.levelNo != undefined && item.levelNo == 3) {
        style = 'padding-left:40px;'
      } else if (item.levelNo != undefined && item.levelNo == 4) {
        style = 'padding-left:50px;'
      } else if (item.levelNo != undefined && item.levelNo == 5) {
        style = 'padding-left:60px;'
      } else if (item.levelNo != undefined && item.levelNo == 6) {
        style = 'padding-left: 80px;'
      } else if (
        item.parentId == '' ||
        item.parentId == null ||
        item.parentId == undefined
      ) {
        style = 'padding-left: 20px;'
      }
      return style
    },
    // 是否有子级菜单
    hasOneShowingChild (children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.attributes && item.attributes.enabled == false) {
          return false
        } else {
          // 临时集（如果只有一个显示子级，将使用该集）
          this.onlyOneChild = item
          return true
        }
      })

      // 如果没有子菜单要显示，请显示父
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath (routePath) {
      if (typeof routePath !== 'string') {
        return ''
      }
      // 对打开目标地址进行二次调整
      // 判断是否为扩展Url，比如http开头的，将在浏览器tab新窗口中打开
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      // 返回对应的路由，方法会把一个路径或路径片段的序列解析为一个绝对路径。
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
