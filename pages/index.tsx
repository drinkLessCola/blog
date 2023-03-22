import FullPage from '@/components/FullPage'
import Layout from '@/components/Layout'
import Menu from '@/components/Menu'
import type { IMenuItem } from '@/components/Menu'
import Scrollbar from '@/components/Scrollbar'
import { useClassName } from '@/hooks/useClassName'
import { useNamespace } from '@/hooks/useNamespace'
import Draw from '@/public/icons/draw.svg'
import JSIcon from '@/public/icons/js.svg'
import GitHubIcon from '@/public/icons/github.svg'
import SvgIcon from '@/components/SvgIcon'
import ArrowBack from '@/public/icons/arrowBack.svg'
import ArrowForward from '@/public/icons/arrowForward.svg'
import { useEffect, useRef } from 'react'
import { articleAPI } from './api/article'
import type { GetServerSideProps, NextPage } from 'next'
import type { IArticleListInDate } from '@/types/article'
import ArticleList from '@/components/ArticleList'


export interface HomePageProps {
  articleList: IArticleListInDate[]
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  try {
    const articleList = await articleAPI.getArticleInTimeOrder({ pageSize: 10, pageIdx: 1 })
    console.log('articleList', articleList)

    return {
      props: {
        articleList
      }
    }
  } catch (err) {
    console.log(err)
    return {
      props: {
        articleList: []
      }
    }
  }
}

const Home: NextPage<HomePageProps> = ({ articleList }) => {
  console.log('Home render')
  const ns = useNamespace('homeLayout')

  // const handleScrollTopChange = useCallback((scrollTop: number) => {
  //   if (scrollTop) updateTop(false)
  //   else updateTop(true)
  // }, [])

  return (
  // <ScrollHandlerContext.Provider value={useForwardContext(ScrollHandlerContext, handleScrollTopChange)}>
      <Layout className={ns.b()}>
        <Scrollbar fitParent>
          <FullPage>
            <Page1></Page1>
            <Page2 articleList={articleList}></Page2>
            <footer className={ns.b('footer')} data-fullpage>
              <div className={ns.be('footer', 'beian')}>
                <p>粤 ICP 备 2022111775 号</p>
              </div>
            </footer>
          </FullPage>
        </Scrollbar>
      </Layout>
  // </ScrollHandlerContext.Provider>
  )
}


const Page1 = () => {
  const ns = useNamespace('homeLayoutHeader')
  return (
    <section className={useClassName(ns.b())} data-fullpage>
    <div className={ns.e('title')}>
      <h1>DrinkLessCola</h1>
      <p>a simple blog records front end learning note and life (maybe, I&lsquo;m lazy) </p>
    </div>
  </section>
  )
}


const MONTH_LABEL_MAP = ['JAN', 'FEB', 'MAT', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const Page2 = ({ articleList }: Pick<HomePageProps, 'articleList'>) => {
  const ns = useNamespace('homeLayout')
  const year = new Date().getFullYear()
  const menu = [
    { label: '前端学习', path: '/1', prefix: <JSIcon /> },
    { label: '摸鱼涂鸦', path: '/2', prefix: <Draw /> },
    { label: '施工中...', path: '/3' }
  ] as unknown as IMenuItem[]

  const calendar = [2, 10, 15, 20, 3, 14, 5, 7, 9, 10, 2, 5]

  const navViewRef = useRef<HTMLElement>(null)
  const handleWheel = (event: WheelEvent) => {
    console.log('homePage scroll!', event.currentTarget, event.target)
    event.stopPropagation()
  }

  useEffect(() => {
    navViewRef.current?.addEventListener('wheel', handleWheel)
    return () => {
      navViewRef.current?.removeEventListener('wheel', handleWheel)
    }
  })

  return (
    <section className={useClassName(ns.b('main'))} data-fullpage >
      <nav className={ns.be('main', 'sidebar')}>
        {/* InfoCard */}
        <div className={useClassName(ns.b('info'), ns.b('card'))}>
          <div className={ns.be('info', 'avatar')}>
            <img src="/avatar.png"></img>
          </div>
          <div className={ns.be('info', 'username')}>DrinkLessCola</div>
          <section className={ns.be('info', 'nav')}>
            <Menu menu={menu}></Menu>
          </section>
          <a className={ns.be('info', 'button')} role="button" href="/">
            <SvgIcon><GitHubIcon /></SvgIcon>
            GitHub
          </a>
        </div>
        {/* Calendar */}
        <div className={useClassName(ns.b('calendar'), ns.b('card'))}>
          <span className={useClassName(ns.be('calendar', 'year'))}> {year} 年</span>
          <span className={useClassName(ns.be('calendar', 'switch'))}>
            <span><SvgIcon><ArrowBack /></SvgIcon></span>
            <span><SvgIcon><ArrowForward /></SvgIcon></span>
          </span>
          {
            calendar.map((articleNum, monthIdx) => (
              <div className={ns.be('calendar', 'item')} key={`calendar-month-${monthIdx}`}>
                <span className={ns.be('calendar', 'label')}>{MONTH_LABEL_MAP[monthIdx]}</span>
                {articleNum}
              </div>
            ))
          }
        </div>
      </nav>

      <main className={useClassName(ns.b('card'), ns.b('navView'))} ref={navViewRef}>
        {/* <ScrollHandlerContext.Provider value={useForwardContext(ScrollHandlerContext, handleScroll)}> */}
          <Scrollbar fitParent>
            <ArticleList></ArticleList>
          </Scrollbar>
        {/* </ScrollHandlerContext.Provider> */}

        {/*
            <ul className={ns.be('navView', 'nav')}>
              <li className="active">时间轴</li>
              <li>归档</li>
            </ul>
        */}
      </main>
    </section>
  )
}

export default Home
