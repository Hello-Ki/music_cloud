import Vue from 'vue'
import VueRouter from 'vue-router'
import Enter from '../views/Enter.vue'
import Home from '../views/Home.vue'
import Discover from '../components/Home/Discover/Discover.vue'
import My from '../components/Home/My.vue'
import Friend from '../components/Home/Friend.vue'
import Store from '../components/Home/Store.vue'
import Musician from '../components/Home/Musician.vue'
import Download from '../components/Home/Download.vue'

import Recommend from '../components/Home/Discover/Recommend/Recommend.vue'
import Song from '../components/Home/Discover/Recommend/Song.vue'
import User from '../components/Home/Discover/User/User.vue'
import UserHome from '../components/Home/Discover/User/UserHome.vue'
import UserEvent from '../components/Home/Discover/User/UserEvent.vue'
import UserFollows from '../components/Home/Discover/User/UserFollows.vue'
import UserFans from '../components/Home/Discover/User/UserFans.vue'
import OutChain from '../components/Home/Discover/Recommend/OutChain.vue'
import Playlist from '../components/Home/Discover/Playlist/Playlist.vue'
import PlaylistDetail from '../components/Home/Discover/Playlist/Detail.vue'
import Toplist from '../components/Home/Discover/Toplist/Toplist.vue'
import Djradio from '../components/Home/Discover/Radio/Djradio.vue'
import Radio from '../components/Home/Discover/Radio/Radio.vue'
import Category from '../components/Home/Discover/Radio/Category.vue'
import Program from '../components/Home/Discover/Radio/Program.vue'
import Djdetail from '../components/Home/Discover/Radio/Djdetail.vue'
import Djrecommend from '../components/Home/Discover/Radio/Djrecommend.vue'
import Djrank from '../components/Home/Discover/Radio/Djrank.vue'
import Artists from '../components/Home/Discover/Artists/Artists.vue'
import RecommendArtist from '../components/Home/Discover/Artists/RecommendArtist.vue'
import SignedArtist from '../components/Home/Discover/Artists/SignedArtist.vue'
import ArtistCategory from '../components/Home/Discover/Artists/ArtistCategory.vue'
import Artist from '../components/Home/Discover/Artist/Artist.vue'
import Artist1 from '../components/Home/Discover/Artist/Artist1.vue'
import Artist2 from '../components/Home/Discover/Artist/Artist2.vue'
import Artist3 from '../components/Home/Discover/Artist/Artist3.vue'
import Artist4 from '../components/Home/Discover/Artist/Artist4.vue'
import MvDetail from '../components/Home/Discover/Artist/Detail.vue'
import Album from '../components/Home/Discover/Album/Album.vue'
import AlbumDetail from '../components/Home/Discover/Album/Detail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'enter',
    component: Enter,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/discover',
    children: [
      {
        name: 'discover',
        path: '/discover',
        component: Discover,
        children: [
          {
            name: 'recommend',
            path: '',
            component: Recommend,
          },
          {
            name: 'toplist',
            path: 'toplist',
            component: Toplist,
          },
          {
            name: 'playlist',
            path: 'playlist',
            component: Playlist,
          },
          {
            name: 'djradio',
            path: 'djradio',
            component: Djradio,
            children: [
              { name: 'radio', path: '', component: Radio },
              { name: 'category', path: 'category/:id', component: Category }
            ]
          },
          {
            name: 'artists',
            path: 'artists',
            component: Artists,
            children: [
              { name: 'recommendArtist', path: '', component: RecommendArtist },
              { name: 'signedArtist', path: 'signed', component: SignedArtist },
              { name: 'artistCategory', path: 'cat', component: ArtistCategory }
            ]
          },
          {
            name: 'album',
            path: 'album',
            component: Album,
          },
          {
            name: 'albumDetail',
            // 动态路由
            path: '/album/:id',
            component: AlbumDetail,
          },
          {
            name: 'mvDetail',
            path: '/mv/:id',
            component: MvDetail
          },
          {
            name: 'playlistDetail',
            path: '/playlist/:id',
            component: PlaylistDetail
          },
          {
            name: 'program',
            path: '/program/:id',
            component: Program
          },
          {
            name: 'djdetail',
            path: '/djradio/:id',
            component: Djdetail
          },
          {
            name: 'djRecommend',
            path: 'djradio/recommend',
            component: Djrecommend
          },
          {
            name: 'djRank',
            path: 'djradio/rank',
            component: Djrank
          },
          {
            name: 'user',
            path: '/user',
            component: User,
            children: [
              { name: 'userHome', path: 'home/:id', component: UserHome },
              { name: 'userEvent', path: 'event/:id', component: UserEvent },
              { name: 'userFollows', path: 'follows/:id', component: UserFollows },
              { name: 'userFans', path: 'fans/:id', component: UserFans }
            ]
          },
          {
            name: 'song',
            path: 'song',
            component: Song
          },
          {
            name: 'outchain',
            path: '/outchain/:type/:id',
            component: OutChain
          },
          {
            name: 'artist',
            path: 'artist',
            component: Artist,
            children: [
              {
                name: 'artist1',
                path: '',
                component: Artist1,
              },
              {
                name: 'artist2',
                path: 'album',
                component: Artist2,
              },
              {
                name: 'artist3',
                path: 'mv',
                component: Artist3,
              },
              {
                name: 'artist4',
                path: 'desc',
                component: Artist4,
              }
            ]
          },
        ],
      },

      { path: '/my', component: My },
      { path: '/friend', component: Friend },
      { path: '/store', component: Store },
      { path: '/musician', component: Musician },
      { name: 'download', path: '/download', component: Download },
    ],
  },
]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

const router = new VueRouter({
  routes,
})

export default router
